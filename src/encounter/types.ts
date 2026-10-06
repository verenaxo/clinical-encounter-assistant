// Which screen is visible. Kept separate from the encounter status:
// e.g. the Recording screen shows both the "recording" and "paused" statuses.
export type Screen = 'setup' | 'ready' | 'recording' | 'review' | 'finalized'

// Where the encounter is in its lifecycle. "draft" = setup not completed yet
// (an incomplete setup must never be labelled "Ready").
export type EncounterStatus =
  | 'draft'
  | 'ready'
  | 'recording'
  | 'paused'
  | 'needsReview'
  | 'finalized'

export type EncounterType = 'assessment' | 'fitting' | 'followUp' | 'other'

export interface Patient {
  id: string
  name: string
  dateOfBirth: string
}

export interface Question {
  id: string
  text: string
  // Stand-in for the AI: a question counts as covered when the transcript
  // mentions one of these words. Manually added questions have none.
  keywords: string[]
  source: 'suggested' | 'manual'
}

export interface TranscriptSegment {
  id: string
  speaker: 'Clinician' | 'Patient'
  text: string
  // Topic assigned by the (simulated) AI; becomes a section heading in Review.
  section: string
  atSecond: number
}

// Editable copy of the transcript used in Review, one block per section.
export interface ReviewSection {
  title: string
  text: string
}

export interface QuickNote {
  id: string
  text: string
  atSecond: number
}

export interface EncounterState {
  screen: Screen
  status: EncounterStatus
  patient: Patient | null
  encounterType: EncounterType | null
  additionalContext: string
  questions: Question[]
  transcript: TranscriptSegment[]
  quickNotes: QuickNote[]
  elapsedSeconds: number
  reviewSections: ReviewSection[]
  // How many transcript segments are already copied into reviewSections, so
  // reopening Review after more recording only appends the new lines.
  reviewedSegmentCount: number
}
