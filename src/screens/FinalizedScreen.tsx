import { useState } from 'react'
import { Badge, Button, Grid, Group, SegmentedControl, Stack, Text, Title } from '@mantine/core'
import { IconDownload, IconFileText, IconLock } from '@tabler/icons-react'
import { Card } from '../components/Card'
import { SectionNav } from '../components/SectionNav'
import { ENCOUNTER_TYPE_LABELS } from '../data/guidance'
import { MOCK_CLINICAL_NOTE } from '../data/mockNote'
import { useEncounter } from '../encounter/EncounterContext'
import type { ReviewSection } from '../encounter/types'
import { downloadText } from '../utils/downloadText'
import { sectionId } from '../utils/sections'

type View = 'note' | 'transcript'

const NOTE_SECTIONS: ReviewSection[] = MOCK_CLINICAL_NOTE.map((section) => ({
  title: section.title,
  text: section.items.map((item) => `• ${item}`).join('\n'),
}))

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

export function FinalizedScreen() {
  const { state, dispatch } = useEncounter()
  const [view, setView] = useState<View>('note')

  // Both views use the same shape, so display, section navigation and download share one code path.
  const sections = view === 'note' ? NOTE_SECTIONS : state.reviewSections
  const viewLabel = view === 'note' ? 'Clinical note' : 'Transcript'
  const finalizedAt = state.finalizedAt ? formatDateTime(state.finalizedAt) : ''

  function handleDownload() {
    const header = [
      viewLabel,
      `Patient: ${state.patient?.name} (${state.patient?.id})`,
      `Encounter type: ${state.encounterType ? ENCOUNTER_TYPE_LABELS[state.encounterType] : ''}`,
      `Finalized: ${finalizedAt}`,
    ].join('\n')
    const body = sections.map((section) => `${section.title}\n${section.text}`).join('\n\n')
    downloadText(`${state.patient?.id}-${view}.txt`, `${header}\n\n${body}\n`)
  }

  return (
    <Stack gap="md">
      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <SectionNav titles={sections.map((section) => section.title)} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Card variant="blue">
            <Group justify="space-between" mb="md">
              <Group gap="sm">
                <span className="icon-tile">
                  <IconFileText size={18} />
                </span>
                <SegmentedControl
                  aria-label="Show"
                  value={view}
                  onChange={(value) => setView(value as View)}
                  data={[
                    { label: 'Clinical note', value: 'note' },
                    { label: 'Transcript', value: 'transcript' },
                  ]}
                />
              </Group>
              <Group gap="xs">
                <Badge color="white" variant="outline" leftSection={<IconLock size={12} />}>
                  Read-only
                </Badge>
                <Button variant="white" color="dark" leftSection={<IconDownload size={16} />} onClick={handleDownload}>
                  Download .txt
                </Button>
              </Group>
            </Group>

            <div className="final-text">
              <Text size="xs" c="var(--color-text-muted)" mb="md">
                {view === 'note'
                  ? 'Structured from the encounter transcript (simulated) · reviewed by clinician'
                  : 'Transcript of the recorded encounter, including review edits'}
              </Text>
              <Stack gap="md">
                {sections.map((section) => (
                  <div key={section.title} id={sectionId(section.title)} className="review-section">
                    <Title order={3} fz={15} fw={600} mb={4} tabIndex={-1}>
                      {section.title}
                    </Title>
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }} lh={1.6}>
                      {section.text}
                    </Text>
                  </div>
                ))}
              </Stack>
            </div>
          </Card>
        </Grid.Col>
      </Grid>

      <Card variant="light">
        <Group justify="space-between">
          <div>
            <Text fz={18}>Finalized on {finalizedAt}</Text>
            <Text size="sm" c="var(--color-text-secondary)">
              Need to make changes? Reopening returns to review and keeps the finalized content.
            </Text>
          </div>
          <Button color="#121317" size="md" onClick={() => dispatch({ type: 'encounterReopened' })}>
            Reopen for editing
          </Button>
        </Group>
      </Card>
    </Stack>
  )
}
