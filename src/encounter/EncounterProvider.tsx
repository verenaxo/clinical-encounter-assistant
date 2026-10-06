import { useMemo, useReducer, type ReactNode } from 'react'
import { EncounterContext } from './EncounterContext'
import { encounterReducer, initialEncounterState } from './encounterReducer'

export function EncounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(encounterReducer, initialEncounterState)
  // Only create a new context value when the state changes (dispatch is stable).
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <EncounterContext.Provider value={value}>{children}</EncounterContext.Provider>
}
