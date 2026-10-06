import { Container, Title } from '@mantine/core'
import { EncounterHeader } from './components/EncounterHeader'
import { useEncounter } from './encounter/EncounterContext'
import { EncounterProvider } from './encounter/EncounterProvider'
import { FinalizedScreen } from './screens/FinalizedScreen'
import { ReadyScreen } from './screens/ReadyScreen'
import { RecordingScreen } from './screens/RecordingScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { SetupScreen } from './screens/SetupScreen'

// The visible screen comes from the encounter state, not from URLs.
// Separate component because useEncounter() only works inside <EncounterProvider>.
function EncounterScreens() {
  const { state } = useEncounter()

  switch (state.screen) {
    case 'setup':
      return <SetupScreen />
    case 'ready':
      return <ReadyScreen />
    case 'recording':
      return <RecordingScreen />
    case 'review':
      return <ReviewScreen />
    case 'finalized':
      return <FinalizedScreen />
  }
}

function App() {
  return (
    <EncounterProvider>
      <Container size="xl" py="xl">
        <Title order={1} fz={50} mb="md">
          AI Transcription
        </Title>
        <EncounterHeader />
        <EncounterScreens />
      </Container>
    </EncounterProvider>
  )
}

export default App
