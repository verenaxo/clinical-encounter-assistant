import type { TranscriptSegment } from '../encounter/types'

// Simulated speech-to-text output, delivered one line at a time while recording.
// Same script for every encounter type in this prototype.
export const MOCK_TRANSCRIPT: Pick<TranscriptSegment, 'speaker' | 'text' | 'section'>[] = [
  { speaker: 'Clinician', text: 'Thanks for coming in today, Amara. What brings you in, and what would you like to achieve?', section: 'Introduction' },
  { speaker: 'Patient', text: 'Mostly the socket. It has been bothering me lately.', section: 'Introduction' },
  { speaker: 'Clinician', text: 'How many hours a day are you up and about?', section: 'Daily activity' },
  { speaker: 'Patient', text: 'Around ten hours. I walk the dog most mornings.', section: 'Daily activity' },
  { speaker: 'Clinician', text: 'Any pain or sore spots after longer walks?', section: 'Pain & skin' },
  { speaker: 'Patient', text: 'It gets sore near the bottom after about thirty minutes.', section: 'Pain & skin' },
  { speaker: 'Clinician', text: 'I can see some redness at the distal end. We will keep an eye on that.', section: 'Pain & skin' },
  { speaker: 'Patient', text: 'I would like to keep walking without having to stop.', section: 'Goals' },
  { speaker: 'Clinician', text: 'Let us check the fit of the socket today and look at the liner.', section: 'Next steps' },
]
