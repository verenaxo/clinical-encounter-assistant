import { createContext, useContext, type Dispatch } from 'react'
import type { EncounterAction } from './encounterReducer'
import type { EncounterState } from './types'

export interface EncounterContextValue {
  state: EncounterState
  dispatch: Dispatch<EncounterAction>
}

export const EncounterContext = createContext<EncounterContextValue | null>(null)

export function useEncounter(): EncounterContextValue {
  const value = useContext(EncounterContext)
  if (!value) throw new Error('useEncounter must be used inside <EncounterProvider>')
  return value
}
