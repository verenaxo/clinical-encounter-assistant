import { useMemo, type CSSProperties } from 'react'
import { Group, Text } from '@mantine/core'
import { IconCheck, IconRefresh } from '@tabler/icons-react'
import { useEncounter } from '../encounter/EncounterContext'
import type { EncounterStatus } from '../encounter/types'
import { useAutosave } from '../encounter/useAutosave'

const STATUS: Record<EncounterStatus, { label: string; color: string }> = {
  draft: { label: 'Setup in progress', color: '#93aed9' },
  ready: { label: 'Ready', color: '#0068b8' },
  recording: { label: 'Recording', color: '#d11b1b' },
  paused: { label: 'Paused', color: '#ed8506' },
  needsReview: { label: 'Needs review', color: '#ed8506' },
  finalized: { label: 'Finalized', color: '#5e9e2f' },
}

// Encounter status (where the encounter is) and save status (whether changes
// are stored) are shown side by side but come from separate sources.
export function EncounterHeader() {
  const { state } = useEncounter()
  const { patient, encounterType, additionalContext, questions, transcript, quickNotes, reviewSections } = state

  // Only the encounter content counts as a change; the ticking timer does not.
  const content = useMemo(
    () => ({ patient, encounterType, additionalContext, questions, transcript, quickNotes, reviewSections }),
    [patient, encounterType, additionalContext, questions, transcript, quickNotes, reviewSections],
  )
  const saveStatus = useAutosave(content)
  const { label, color } = STATUS[state.status]

  return (
    <Group gap="md" mb="lg">
      <span className="status-pill">
        <span className="status-pill__dot" style={{ '--dot': color } as CSSProperties} aria-hidden />
        <span className="visually-hidden">Encounter status: </span>
        {label}
      </span>

      <Text size="sm" c="var(--color-text-muted)" className="save-indicator" role="status">
        {saveStatus === 'saving' && (
          <>
            <IconRefresh size={14} aria-hidden /> Saving…
          </>
        )}
        {saveStatus === 'saved' && (
          <>
            <IconCheck size={14} aria-hidden /> Saved
          </>
        )}
      </Text>
    </Group>
  )
}
