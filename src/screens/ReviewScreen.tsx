import { useState } from 'react'
import { Button, Grid, Group, Stack, Text, Textarea, Title } from '@mantine/core'
import { IconArrowBackUp, IconCheck, IconFileText, IconMicrophone, IconSparkles } from '@tabler/icons-react'
import { Card } from '../components/Card'
import { CardTitle } from '../components/CardTitle'
import { SectionNav } from '../components/SectionNav'
import { applyNotes } from '../encounter/applyNotes'
import { useEncounter } from '../encounter/EncounterContext'
import type { ReviewSection } from '../encounter/types'
import { formatTime } from '../utils/formatTime'
import { sectionId } from '../utils/sections'

export function ReviewScreen() {
  const { state, dispatch } = useEncounter()
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  // The last applied change: which sections changed and the text before, for Undo.
  const [applied, setApplied] = useState<{ changedTitles: string[]; previous: ReviewSection[] } | null>(null)

  function handleApply() {
    const result = applyNotes(state.reviewSections, notes)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError(null)
    setApplied({ changedTitles: result.changedTitles, previous: state.reviewSections })
    dispatch({ type: 'reviewSectionsReplaced', sections: result.sections })
  }

  function handleUndo() {
    if (!applied) return
    dispatch({ type: 'reviewSectionsReplaced', sections: applied.previous })
    setApplied(null)
  }

  function handleEdit(title: string, text: string) {
    dispatch({ type: 'reviewSectionEdited', title, text })
    setApplied(null) // Undo would also discard this manual edit, so it is no longer offered
  }

  return (
    <Stack gap="md">
      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <SectionNav titles={state.reviewSections.map((section) => section.title)} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Card variant="blue">
            <Group justify="space-between" mb="md">
              <CardTitle icon={<IconFileText size={18} />}>Transcript</CardTitle>
              <Text size="xs" opacity={0.75}>
                Select any text to edit it
              </Text>
            </Group>

            <Stack gap="md">
              {state.reviewSections.map((section) => (
                <div
                  key={section.title}
                  id={sectionId(section.title)}
                  className={`review-section ${applied?.changedTitles.includes(section.title) ? 'review-section--changed' : ''}`}
                >
                  <Title order={3} fz={15} fw={600} mb={6}>
                    {section.title}
                  </Title>
                  <Textarea
                    aria-label={`${section.title} transcript`}
                    autosize
                    minRows={2}
                    value={section.text}
                    onChange={(e) => handleEdit(section.title, e.currentTarget.value)}
                  />
                </div>
              ))}

              <div>
                <Textarea
                  label="Add notes or correction instructions"
                  placeholder={'e.g. Replace "Around ten hours" with "About ten hours a day"'}
                  autosize
                  minRows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.currentTarget.value)}
                  error={error}
                />
                <Group mt="xs" gap="xs">
                  <Button
                    variant="white"
                    color="dark"
                    leftSection={<IconSparkles size={16} />}
                    disabled={!notes.trim()}
                    onClick={handleApply}
                  >
                    Apply notes
                  </Button>
                  {notes && (
                    <Button variant="subtle" color="white" onClick={() => { setNotes(''); setError(null); setApplied(null) }}>
                      Dismiss notes
                    </Button>
                  )}
                </Group>

                {applied && (
                  <Group className="tile applied" justify="space-between" mt="sm" role="status">
                    <Text size="sm">
                      <IconCheck size={14} /> Changed in: {applied.changedTitles.join(', ')}
                    </Text>
                    <Button size="compact-sm" variant="white" color="dark" leftSection={<IconArrowBackUp size={14} />} onClick={handleUndo}>
                      Undo
                    </Button>
                  </Group>
                )}
              </div>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card variant="light">
        <Group justify="space-between">
          <div>
            <Text fz={18}>Recording stopped · {formatTime(state.elapsedSeconds)} recorded</Text>
            <Text size="sm" c="var(--color-text-secondary)">
              Resuming appends new transcript lines. Your edits are kept.
            </Text>
          </div>
          <Group gap="xs">
            <Button
              variant="default"
              size="md"
              leftSection={<IconMicrophone size={18} />}
              onClick={() => dispatch({ type: 'recordingStarted' })}
            >
              Resume recording
            </Button>
            <Button
              color="#121317"
              size="md"
              leftSection={<IconCheck size={18} />}
              onClick={() => dispatch({ type: 'encounterFinalized', at: new Date().toISOString() })}
            >
              Finalize
            </Button>
          </Group>
        </Group>
      </Card>
    </Stack>
  )
}
