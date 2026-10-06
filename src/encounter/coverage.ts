import type { Question, TranscriptSegment } from './types'

// Stand-in for the AI: a question is covered once the transcript contains one of
// its keywords. Questions without keywords (added by the clinician) are not tracked.
export function getCoveredQuestionIds(questions: Question[], transcript: TranscriptSegment[]): Set<string> {
  const text = transcript.map((segment) => segment.text.toLowerCase()).join(' ')
  return new Set(
    questions.filter((q) => q.keywords.some((keyword) => text.includes(keyword))).map((q) => q.id),
  )
}
