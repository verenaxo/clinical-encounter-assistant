import type { ReviewSection } from './types'

export type ApplyNotesResult =
  | { ok: true; sections: ReviewSection[]; changedTitles: string[] }
  | { ok: false; error: string }

// Stand-in for the AI: understands one instruction, Replace "old" with "new".
const REPLACE = /replace\s+["“'](.+?)["”']\s+with\s+["“'](.+?)["”']/i

export function applyNotes(sections: ReviewSection[], notes: string): ApplyNotesResult {
  const match = notes.match(REPLACE)
  if (!match) {
    return { ok: false, error: 'This prototype understands instructions like: Replace "Around ten hours" with "About ten hours a day".' }
  }

  const [, from, to] = match
  const changedTitles: string[] = []
  const updated = sections.map((section) => {
    if (!section.text.includes(from)) return section
    changedTitles.push(section.title)
    return { ...section, text: section.text.replaceAll(from, to) }
  })

  if (changedTitles.length === 0) return { ok: false, error: `“${from}” was not found in the transcript.` }
  return { ok: true, sections: updated, changedTitles }
}
