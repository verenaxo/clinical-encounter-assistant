// Simulated AI output: a structured SOAP note "generated" from the mock transcript.
// Stored separately from the transcript and never replaces it.
export const MOCK_CLINICAL_NOTE: { title: string; items: string[] }[] = [
  {
    title: 'Subjective',
    items: [
      'Reports socket discomfort; sore near the distal end after walking for about 30 minutes.',
      'Up and about around ten hours a day; walks the dog most mornings.',
      'Goal: keep walking without having to stop.',
    ],
  },
  { title: 'Objective', items: ['Redness observed at the distal end of the residual limb.'] },
  {
    title: 'Assessment',
    items: ['Distal discomfort and redness during longer walks; socket and liner fit to be reviewed.'],
  },
  {
    title: 'Plan',
    items: ['Check socket fit and review the liner.', 'Monitor skin condition at the distal end.'],
  },
]
