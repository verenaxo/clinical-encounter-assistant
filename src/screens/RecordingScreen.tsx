import { useEffect, useMemo, useRef } from 'react'
import { Button, Grid, Group, List, Stack, Text } from '@mantine/core'
import { IconArrowRight, IconMicrophone, IconPlayerPauseFilled } from '@tabler/icons-react'
import { Card } from '../components/Card'
import { GuidanceQuestions } from '../components/GuidanceQuestions'
import { getCoveredQuestionIds } from '../encounter/coverage'
import { useEncounter } from '../encounter/EncounterContext'
import { useSimulatedRecording } from '../encounter/useSimulatedRecording'

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function RecordingScreen() {
  useSimulatedRecording()
  const { state, dispatch } = useEncounter()
  const isRecording = state.status === 'recording'

  // Derived from questions + transcript on every new segment; nothing extra is stored.
  const covered = useMemo(
    () => getCoveredQuestionIds(state.questions, state.transcript),
    [state.questions, state.transcript],
  )
  const missing = state.questions.filter((q) => q.keywords.length > 0 && !covered.has(q.id))

  // Keep the newest transcript line in view.
  const transcriptRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
  }, [state.transcript.length])

  return (
    <Stack gap="md">
      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <GuidanceQuestions covered={covered} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card variant="light" className="transcript-card">
            <Text className="label" c="var(--color-text-muted)" mb="xs">
              Live transcript
            </Text>
            <div ref={transcriptRef} className="transcript-scroll" role="log" aria-label="Live transcript">
              {state.transcript.map((segment) => (
                <Text key={segment.id} size="sm" mb="xs">
                  <strong>{segment.speaker}:</strong> {segment.text}
                </Text>
              ))}
              <Text size="sm" c="var(--color-text-muted)">
                {isRecording ? 'Listening…' : 'Paused'}
              </Text>
            </div>
          </Card>
        </Grid.Col>
      </Grid>

      <Card variant="blue">
        <Group justify="space-between">
          <Group>
            <span className={`mic-indicator ${isRecording ? 'mic-indicator--active' : ''}`} aria-hidden>
              <IconMicrophone size={24} />
            </span>
            <div>
              <Text className="label">{isRecording ? 'Recording' : 'Paused'} · simulated</Text>
              <Text fz={36} fw={300} lh={1.1}>
                <span className="visually-hidden">Elapsed time </span>
                {formatTime(state.elapsedSeconds)}
              </Text>
            </div>
          </Group>

          {isRecording ? (
            <Button
              variant="white"
              color="dark"
              size="md"
              leftSection={<IconPlayerPauseFilled size={16} />}
              onClick={() => dispatch({ type: 'recordingPaused' })}
            >
              Pause
            </Button>
          ) : (
            <Group gap="xs">
              <Button
                variant="white"
                color="dark"
                size="md"
                leftSection={<IconMicrophone size={18} />}
                onClick={() => dispatch({ type: 'recordingStarted' })}
              >
                Resume recording
              </Button>
              <Button
                color="#121317"
                size="md"
                rightSection={<IconArrowRight size={18} />}
                onClick={() => dispatch({ type: 'reviewOpened' })}
              >
                Review note
              </Button>
            </Group>
          )}
        </Group>

        {!isRecording && missing.length > 0 && (
          <div className="tile missing" role="status">
            <Text fw={600}>
              {missing.length} {missing.length === 1 ? 'question is' : 'questions are'} not covered yet
            </Text>
            <List size="sm" mt={4} c="white">
              {missing.map((q) => (
                <List.Item key={q.id}>{q.text}</List.Item>
              ))}
            </List>
            <Text size="sm" mt="xs" opacity={0.8}>
              Resume recording to cover them, or continue to review.
            </Text>
          </div>
        )}
      </Card>
    </Stack>
  )
}
