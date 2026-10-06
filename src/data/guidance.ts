import type { EncounterType, Question } from '../encounter/types'

export const ENCOUNTER_TYPE_LABELS: Record<EncounterType, string> = {
  assessment: 'Assessment',
  fitting: 'Fitting',
  followUp: 'Follow-up / adjustment',
  other: 'Other',
}

type Suggestion = Pick<Question, 'text' | 'keywords'>

// Mock guidance: suggestions only, not a complete clinical or insurance checklist.
const SUGGESTIONS: Record<EncounterType, Suggestion[]> = {
  assessment: [
    { text: 'What brings you in today, and what are your main goals?', keywords: ['goal', 'brings you in', 'would like'] },
    { text: 'How would you describe your current mobility and daily activity?', keywords: ['walk', 'mobility', 'activity', 'hours a day'] },
    { text: 'Any pain, skin changes, or sensitivity around the residual limb?', keywords: ['pain', 'sore', 'red', 'skin'] },
    { text: 'Which devices have you used before, and how did they work for you?', keywords: ['prosthesis', 'device', 'liner'] },
  ],
  fitting: [
    { text: 'How does the device feel when standing and walking?', keywords: ['feel', 'standing', 'walk'] },
    { text: 'Any pressure points or discomfort?', keywords: ['pressure', 'discomfort', 'sore'] },
    { text: 'Is donning and doffing manageable on your own?', keywords: ['put on', 'take off', 'don'] },
    { text: 'Which activities should the device support?', keywords: ['activity', 'activities', 'sport'] },
  ],
  followUp: [
    { text: 'What has changed since your last visit?', keywords: ['since', 'last visit', 'changed'] },
    { text: 'How many hours a day do you wear the device?', keywords: ['hours a day', 'wear'] },
    { text: 'Any pain, skin changes, or new issues?', keywords: ['pain', 'sore', 'red', 'skin'] },
    { text: 'Are the previous adjustments working for you?', keywords: ['adjust', 'working', 'better'] },
  ],
  other: [
    { text: 'What is the main reason for this visit?', keywords: ['reason', 'brings you in'] },
    { text: 'Any pain, skin changes, or concerns?', keywords: ['pain', 'sore', 'concern'] },
  ],
}

export function suggestedQuestions(type: EncounterType): Question[] {
  return SUGGESTIONS[type].map((s, i) => ({
    ...s,
    id: `${type}-${i}`,
    source: 'suggested',
  }))
}
