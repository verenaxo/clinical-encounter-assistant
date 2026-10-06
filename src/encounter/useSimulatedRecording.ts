import { useEffect } from 'react'
import { MOCK_TRANSCRIPT } from '../data/mockTranscript'
import { useEncounter } from './EncounterContext'

const SEGMENT_DELAY_MS = 3000

// Simulates recording: a 1-second timer plus transcript lines arriving every few seconds.
// Everything runs only while the status is "recording", so pausing stops both,
// and leaving the screen clears the timers (effect cleanup).
export function useSimulatedRecording() {
  const { state, dispatch } = useEncounter()
  const isRecording = state.status === 'recording'

  useEffect(() => {
    if (!isRecording) return
    const timer = setInterval(() => dispatch({ type: 'timeTicked' }), 1000)
    return () => clearInterval(timer)
  }, [isRecording, dispatch])

  // The next line is picked by how much transcript already exists, so resuming
  // continues the script and appends instead of starting over.
  const nextLine = MOCK_TRANSCRIPT[state.transcript.length]

  useEffect(() => {
    if (!isRecording || !nextLine) return
    const timeout = setTimeout(
      () => dispatch({ type: 'segmentReceived', segment: { id: crypto.randomUUID(), ...nextLine } }),
      SEGMENT_DELAY_MS,
    )
    return () => clearTimeout(timeout)
  }, [isRecording, nextLine, dispatch])
}
