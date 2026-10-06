import { useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Grid,
  Group,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import {
  IconArrowRight,
  IconChevronRight,
  IconCircle,
  IconCircleCheck,
  IconClipboardText,
  IconSearch,
  IconUser,
} from '@tabler/icons-react'
import { Card } from '../components/Card'
import { CardTitle } from '../components/CardTitle'
import { ENCOUNTER_TYPE_LABELS } from '../data/guidance'
import { findPatients } from '../data/patients'
import { useEncounter } from '../encounter/EncounterContext'
import type { EncounterType, Patient } from '../encounter/types'

const ENCOUNTER_TYPES = Object.keys(ENCOUNTER_TYPE_LABELS) as EncounterType[]

interface SetupForm {
  patient: Patient | null
  encounterType: EncounterType | null
  additionalContext: string
}

type SetupErrors = Partial<Record<keyof SetupForm, string>>

function validateSetup(form: SetupForm): SetupErrors {
  const errors: SetupErrors = {}
  if (!form.patient) errors.patient = 'Select a patient to continue.'
  if (!form.encounterType) errors.encounterType = 'Choose an encounter type.'
  if (form.encounterType === 'other' && !form.additionalContext.trim()) {
    errors.additionalContext = 'Briefly describe the encounter when "Other" is selected.'
  }
  return errors
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function SetupScreen() {
  const { state, dispatch } = useEncounter()

  // Local form state, pre-filled when coming back from Ready ("Change patient" keeps context).
  const [form, setForm] = useState<SetupForm>({
    patient: state.patient,
    encounterType: state.encounterType,
    additionalContext: state.additionalContext,
  })
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const typeGroupRef = useRef<HTMLDivElement>(null)
  const contextRef = useRef<HTMLTextAreaElement>(null)

  const results = useMemo(() => findPatients(query), [query])

  // Derived, not stored: errors show after the first Continue and clear as fields are fixed.
  const errors = submitted ? validateSetup(form) : {}

  function update(patch: Partial<SetupForm>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function handleContinue() {
    setSubmitted(true)
    const found = validateSetup(form)

    if (found.patient) return searchRef.current?.focus()
    if (found.encounterType) return typeGroupRef.current?.querySelector('input')?.focus()
    if (found.additionalContext) return contextRef.current?.focus()

    if (form.patient && form.encounterType) {
      dispatch({
        type: 'setupCompleted',
        patient: form.patient,
        encounterType: form.encounterType,
        additionalContext: form.additionalContext.trim(),
      })
    }
  }

  const typeComplete = !!form.encounterType && (form.encounterType !== 'other' || !!form.additionalContext.trim())

  return (
    <Stack gap="md">
      <Card variant="blue">
        <Group justify="space-between" mb="md">
          <CardTitle icon={<IconUser size={18} />}>Select patient</CardTitle>
          <Badge color="orange">Required</Badge>
        </Group>

        {form.patient ? (
          <Group className="tile" p="md" justify="space-between">
            <Group>
              <Avatar color="white" radius="md">
                {initials(form.patient.name)}
              </Avatar>
              <div>
                <Text fw={600}>{form.patient.name}</Text>
                <Text size="sm" opacity={0.8}>
                  {form.patient.id} · Born {formatDate(form.patient.dateOfBirth)}
                </Text>
              </div>
            </Group>
            <Button variant="white" color="dark" onClick={() => update({ patient: null })}>
              Change patient
            </Button>
          </Group>
        ) : (
          <>
            <TextInput
              ref={searchRef}
              label="Search by patient name or ID"
              placeholder="Type a patient name or ID, e.g. PT-208114"
              leftSection={<IconSearch size={18} />}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              error={errors.patient}
            />
            <Text className="label" mt="md" mb="xs">
              {query.trim() ? `Results (${results.length})` : 'Recent patients'}
            </Text>
            {results.length === 0 ? (
              <Text size="sm">No patients match “{query.trim()}”. Check the spelling or search by patient ID.</Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
                {results.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    className="tile patient-row"
                    onClick={() => {
                      update({ patient })
                      setQuery('')
                    }}
                  >
                    <Avatar color="white" radius="md" size="sm">
                      {initials(patient.name)}
                    </Avatar>
                    <span className="patient-row__text">
                      <Text fw={600} size="sm">
                        {patient.name}
                      </Text>
                      <Text size="xs" opacity={0.75}>
                        {patient.id}
                      </Text>
                    </span>
                    <IconChevronRight size={16} opacity={0.7} />
                  </button>
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </Card>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card variant="blue">
            <CardTitle icon={<IconClipboardText size={18} />}>Encounter context</CardTitle>

            <div ref={typeGroupRef}>
              <Radio.Group
                mt="md"
                label="Encounter type"
                withAsterisk
                value={form.encounterType}
                onChange={(value) => update({ encounterType: value as EncounterType })}
                error={errors.encounterType}
              >
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mt="xs">
                  {ENCOUNTER_TYPES.map((type) => (
                    <Radio key={type} value={type} label={ENCOUNTER_TYPE_LABELS[type]} className="tile radio-tile" />
                  ))}
                </SimpleGrid>
              </Radio.Group>
            </div>

            <Textarea
              ref={contextRef}
              mt="md"
              label="Additional context"
              description={form.encounterType === 'other' ? 'Required: briefly describe the encounter' : 'Optional'}
              withAsterisk={form.encounterType === 'other'}
              placeholder="Add anything relevant, e.g. reason for visit, current device, or concerns to discuss."
              autosize
              minRows={3}
              value={form.additionalContext}
              onChange={(e) => update({ additionalContext: e.currentTarget.value })}
              error={errors.additionalContext}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card variant="light" className="next-step">
            <div>
              <Title order={2} fz={30} fw={300}>
                Continue to recording
              </Title>
              <Text size="sm" mt="xs" c="var(--color-text-secondary)">
                Select a patient and encounter type, then continue to review guidance.
              </Text>
            </div>
            <Stack gap="xs">
              <Requirement done={!!form.patient}>Patient selected</Requirement>
              <Requirement done={typeComplete}>Encounter type chosen</Requirement>
              <Button color="#121317" size="md" mt="xs" rightSection={<IconArrowRight size={18} />} onClick={handleContinue}>
                Continue
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

function Requirement({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <Group gap={8}>
      {done ? <IconCircleCheck size={16} color="#3f8f2f" /> : <IconCircle size={16} color="#8a919c" />}
      <Text size="sm" c="var(--color-text-secondary)">
        {children}
      </Text>
    </Group>
  )
}
