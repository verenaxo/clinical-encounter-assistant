import type { Patient } from '../encounter/types'

// Synthetic patients only.
export const PATIENTS: Patient[] = [
  { id: 'PT-208114', name: 'Amara Okafor', dateOfBirth: '1968-03-14' },
  { id: 'PT-193052', name: 'Daniel Hartmann', dateOfBirth: '1955-11-02' },
  { id: 'PT-210487', name: 'Elena Rossi', dateOfBirth: '1990-06-21' },
  { id: 'PT-187320', name: 'Jonas Weber', dateOfBirth: '1979-01-09' },
  { id: 'PT-201965', name: 'Mei Lin Chen', dateOfBirth: '1984-09-30' },
  { id: 'PT-176408', name: 'Samuel Brooks', dateOfBirth: '1962-04-17' },
  { id: 'PT-214230', name: 'Aisha Rahman', dateOfBirth: '2001-12-05' },
  { id: 'PT-199871', name: 'Lukas Novak', dateOfBirth: '1971-07-23' },
  { id: 'PT-205516', name: 'Clara Fischer', dateOfBirth: '1958-02-11' },
  { id: 'PT-181104', name: 'Tomás Alvarez', dateOfBirth: '1987-10-03' },
]

// Most recent first.
export const RECENT_PATIENT_IDS = [
  'PT-208114',
  'PT-193052',
  'PT-210487',
  'PT-187320',
  'PT-201965',
  'PT-176408',
]

// Empty query: recent patients. Otherwise: name or ID matches, sorted A–Z by name.
export function findPatients(query: string): Patient[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return RECENT_PATIENT_IDS.map((id) => PATIENTS.find((p) => p.id === id)).filter(
      (p): p is Patient => p !== undefined,
    )
  }
  return PATIENTS.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)).sort(
    (a, b) => a.name.localeCompare(b.name),
  )
}
