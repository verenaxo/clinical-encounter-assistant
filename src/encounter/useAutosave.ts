import { useEffect, useRef, useState } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved'

// Simulated autosave: whenever `data` changes, show "Saving…" shortly after,
// then "Saved". Nothing is sent anywhere; a real app would call its API here.
// Rapid changes (e.g. a new transcript line) restart the timers, like a debounce.
export function useAutosave(data: unknown): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const lastData = useRef(data)

  useEffect(() => {
    if (lastData.current === data) return // nothing changed (also covers the first render)
    lastData.current = data

    const saving = setTimeout(() => setStatus('saving'), 300)
    const saved = setTimeout(() => setStatus('saved'), 1000)
    return () => {
      clearTimeout(saving)
      clearTimeout(saved)
    }
  }, [data])

  return status
}
