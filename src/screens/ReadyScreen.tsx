import { Button, Grid, Stack, Text, Title } from '@mantine/core'
import { IconPlayerRecordFilled } from '@tabler/icons-react'
import { Card } from '../components/Card'
import { GuidanceQuestions } from '../components/GuidanceQuestions'
import { ENCOUNTER_TYPE_LABELS } from '../data/guidance'
import { useEncounter } from '../encounter/EncounterContext'

export function ReadyScreen() {
  const { state, dispatch } = useEncounter()
  const { patient, encounterType, additionalContext } = state

  return (
    <Grid gap="md">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <GuidanceQuestions />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card variant="light" className="next-step">
          <Stack gap={4}>
            <Text className="label" c="var(--color-text-muted)">
              Patient
            </Text>
            <Text fw={600}>{patient?.name}</Text>
            <Text size="sm" c="var(--color-text-secondary)">
              {patient?.id} · {encounterType && ENCOUNTER_TYPE_LABELS[encounterType]}
            </Text>
            {additionalContext && (
              <Text size="sm" c="var(--color-text-secondary)">
                {additionalContext}
              </Text>
            )}
            <Button
              variant="subtle"
              size="compact-sm"
              w="fit-content"
              px={0}
              onClick={() => dispatch({ type: 'setupReopened' })}
            >
              Edit setup
            </Button>
          </Stack>

          <Stack gap="xs">
            <Title order={2} fz={30} fw={300}>
              Ready to record
            </Title>
            <Text size="sm" c="var(--color-text-secondary)">
              Recording and transcription are simulated in this prototype.
            </Text>
            <Button
              color="#121317"
              size="md"
              mt="xs"
              leftSection={<IconPlayerRecordFilled size={16} color="#ff6b6b" />}
              onClick={() => dispatch({ type: 'recordingStarted' })}
            >
              Start recording
            </Button>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  )
}
