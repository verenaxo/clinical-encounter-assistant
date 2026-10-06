import { createContext, useContext, type Dispatch } from 'react'
import type { EncounterAction } from './encounterReducer'
import type { EncounterState } from './types'

export interface EncounterContextValue {
  state: EncounterState
  dispatch: Dispatch<EncounterAction>
}

// Context = a way to share data with every component below the provider without passing props down.
// The default is null so that using it outside the provider fails loudly instead of silently.
export const EncounterContext = createContext<EncounterContextValue | null>(null)

// Custom hook: components call useEncounter() instead of touching the context directly.
export function useEncounter(): EncounterContextValue {
  const value = useContext(EncounterContext)
  if (!value) throw new Error('useEncounter must be used inside <EncounterProvider>')
  return value
}
