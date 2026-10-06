import { useState, type FormEvent } from 'react'
import { ActionIcon, Badge, Group, Stack, Text, TextInput } from '@mantine/core'
import { IconCircle, IconCircleCheckFilled, IconListCheck, IconPlus, IconX } from '@tabler/icons-react'
import { useEncounter } from '../encounter/EncounterContext'
import { Card } from './Card'
import { CardTitle } from './CardTitle'

interface GuidanceQuestionsProps {
  // When provided (during recording), each tracked question shows whether it is covered.
  covered?: Set<string>
}

export function GuidanceQuestions({ covered }: GuidanceQuestionsProps) {
  const { state, dispatch } = useEncounter()
  const [draft, setDraft] = useState('')

  const tracked = state.questions.filter((q) => q.keywords.length > 0)
  const coveredCount = covered ? tracked.filter((q) => covered.has(q.id)).length : 0

  // A real <form>, so pressing Enter in the input also adds the question.
  function handleAdd(event: FormEvent) {
    event.preventDefault() // stop the browser from reloading the page
    const text = draft.trim()
    if (!text) return // an empty question never becomes a list item
    // The ID is created here, not in the reducer, to keep the reducer pure.
    dispatch({ type: 'questionAdded', id: crypto.randomUUID(), text })
    setDraft('')
  }

  return (
    <Card variant="blue">
      <Group justify="space-between" mb="md">
        <CardTitle icon={<IconListCheck size={18} />}>Guidance questions</CardTitle>
        {covered ? (
          <Badge size="lg" color="white" variant="outline">
            {coveredCount} of {tracked.length} covered
          </Badge>
        ) : (
          <Text size="xs" opacity={0.75}>
            Suggestions only · not a complete checklist
          </Text>
        )}
      </Group>

      <Stack component="ul" gap="xs" className="question-list">
        {state.questions.map((question) => {
          const isTracked = question.keywords.length > 0
          const isCovered = covered?.has(question.id) ?? false
          return (
            <Group component="li" key={question.id} className="tile question" gap="sm" wrap="nowrap">
              {covered && isTracked &&
                (isCovered ? (
                  <IconCircleCheckFilled size={20} color="#b6f09c" aria-hidden />
                ) : (
                  <IconCircle size={20} opacity={0.7} aria-hidden />
                ))}
              <Text flex={1} fw={covered ? 600 : 500}>
                {question.text}
              </Text>
              {isCovered && <Text className="label">Covered</Text>}
              {question.source === 'manual' && (
                <Badge color="white" variant="outline">
                  Added by you
                </Badge>
              )}
              {/* Icon-only button: aria-label gives screen readers a name for it. */}
              <ActionIcon
                variant="subtle"
                color="white"
                aria-label={`Remove question: ${question.text}`}
                onClick={() => dispatch({ type: 'questionRemoved', id: question.id })}
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          )
        })}
      </Stack>

      <form onSubmit={handleAdd}>
        <Group mt="md" align="flex-end" gap="xs">
          <TextInput
            flex={1}
            label="Add a question"
            placeholder="Type a question for this encounter"
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
          />
          <ActionIcon type="submit" size={36} variant="white" color="dark" aria-label="Add question">
            <IconPlus size={18} />
          </ActionIcon>
        </Group>
      </form>
    </Card>
  )
}
