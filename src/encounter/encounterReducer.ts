import { suggestedQuestions } from '../data/guidance'
import type {
  EncounterState,
  EncounterStatus,
  EncounterType,
  Patient,
  ReviewSection,
  TranscriptSegment,
} from './types'

export type EncounterAction =
  | { type: 'setupCompleted'; patient: Patient; encounterType: EncounterType; additionalContext: string }
  | { type: 'setupReopened' }
  | { type: 'contextUpdated'; encounterType: EncounterType; additionalContext: string }
  | { type: 'questionAdded'; id: string; text: string }
  | { type: 'questionRemoved'; id: string }
  | { type: 'recordingStarted' }
  | { type: 'recordingPaused' }
  | { type: 'timeTicked' }
  | { type: 'segmentReceived'; segment: Omit<TranscriptSegment, 'atSecond'> }
  | { type: 'noteAdded'; id: string; text: string }
  | { type: 'reviewOpened' }
  | { type: 'reviewSectionEdited'; title: string; text: string }
  | { type: 'reviewSectionsReplaced'; sections: ReviewSection[] }
  | { type: 'encounterFinalized'; at: string }
  | { type: 'encounterReopened' }

// The state machine: which actions are allowed from which status.
// Anything not listed here is rejected, so impossible transitions
// (e.g. finalizing while recording) cannot happen.
const ALLOWED_FROM: Record<EncounterAction['type'], readonly EncounterStatus[]> = {
  setupCompleted: ['draft'],
  setupReopened: ['ready'],
  contextUpdated: ['ready', 'recording', 'paused', 'needsReview'],
  questionAdded: ['ready', 'recording', 'paused'],
  questionRemoved: ['ready', 'recording', 'paused'],
  recordingStarted: ['ready', 'paused', 'needsReview'],
  recordingPaused: ['recording'],
  timeTicked: ['recording'],
  segmentReceived: ['recording'],
  noteAdded: ['recording', 'paused'],
  reviewOpened: ['paused'],
  reviewSectionEdited: ['needsReview'],
  reviewSectionsReplaced: ['needsReview'],
  encounterFinalized: ['needsReview'],
  encounterReopened: ['finalized'],
}

export function canDispatch(state: EncounterState, type: EncounterAction['type']): boolean {
  return ALLOWED_FROM[type].includes(state.status)
}

export const initialEncounterState: EncounterState = {
  screen: 'setup',
  status: 'draft',
  patient: null,
  encounterType: null,
  additionalContext: '',
  questions: [],
  transcript: [],
  quickNotes: [],
  elapsedSeconds: 0,
  reviewSections: [],
  reviewedSegmentCount: 0,
  finalizedAt: null,
}

// Appends transcript lines to their section's text, keeping any edits already made.
function appendToSections(sections: ReviewSection[], segments: TranscriptSegment[]): ReviewSection[] {
  const result = sections.map((section) => ({ ...section }))
  for (const segment of segments) {
    const line = `${segment.speaker}: ${segment.text}`
    const existing = result.find((section) => section.title === segment.section)
    if (existing) existing.text = existing.text ? `${existing.text}\n${line}` : line
    else result.push({ title: segment.section, text: line })
  }
  return result
}

export function encounterReducer(state: EncounterState, action: EncounterAction): EncounterState {
  if (!canDispatch(state, action.type)) {
    if (import.meta.env.DEV) {
      console.warn(`Ignored "${action.type}": not allowed while status is "${state.status}"`)
    }
    return state
  }

  switch (action.type) {
    case 'setupCompleted':
      return {
        ...state,
        screen: 'ready',
        status: 'ready',
        patient: action.patient,
        encounterType: action.encounterType,
        additionalContext: action.additionalContext,
        // Fresh suggestions for the chosen type; questions the clinician added survive.
        questions: [
          ...suggestedQuestions(action.encounterType),
          ...state.questions.filter((q) => q.source === 'manual'),
        ],
      }

    case 'setupReopened':
      // Back to setup before recording, keeping everything entered so far.
      return { ...state, screen: 'setup', status: 'draft' }

    case 'contextUpdated':
      // Context edits never rewrite questions or transcript once recording has begun.
      return { ...state, encounterType: action.encounterType, additionalContext: action.additionalContext }

    case 'questionAdded':
      return {
        ...state,
        questions: [...state.questions, { id: action.id, text: action.text, keywords: [], source: 'manual' }],
      }

    case 'questionRemoved':
      return { ...state, questions: state.questions.filter((q) => q.id !== action.id) }

    case 'recordingStarted':
      return { ...state, screen: 'recording', status: 'recording' }

    case 'recordingPaused':
      return { ...state, status: 'paused' }

    case 'timeTicked':
      return { ...state, elapsedSeconds: state.elapsedSeconds + 1 }

    case 'segmentReceived':
      // Append, never replace: resuming adds to the existing transcript.
      return {
        ...state,
        transcript: [...state.transcript, { ...action.segment, atSecond: state.elapsedSeconds }],
      }

    case 'noteAdded':
      return {
        ...state,
        quickNotes: [...state.quickNotes, { id: action.id, text: action.text, atSecond: state.elapsedSeconds }],
      }

    case 'reviewOpened':
      // Copy only transcript lines not yet in Review, so earlier edits survive a resume.
      return {
        ...state,
        screen: 'review',
        status: 'needsReview',
        reviewSections: appendToSections(state.reviewSections, state.transcript.slice(state.reviewedSegmentCount)),
        reviewedSegmentCount: state.transcript.length,
      }

    case 'reviewSectionEdited':
      return {
        ...state,
        reviewSections: state.reviewSections.map((section) =>
          section.title === action.title ? { ...section, text: action.text } : section,
        ),
      }

    case 'reviewSectionsReplaced':
      return { ...state, reviewSections: action.sections }

    case 'encounterFinalized':
      return { ...state, screen: 'finalized', status: 'finalized', finalizedAt: action.at }

    case 'encounterReopened':
      return { ...state, screen: 'review', status: 'needsReview' }
  }
}
