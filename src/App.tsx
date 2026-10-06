import { Badge, Button, Container, Group, Title } from '@mantine/core'
import { useEncounter } from './encounter/EncounterContext'
import { EncounterProvider } from './encounter/EncounterProvider'
import { SetupScreen } from './screens/SetupScreen'

function EncounterScreens() {
  const { state, dispatch } = useEncounter()

  switch (state.screen) {
    case 'setup':
      return <SetupScreen />
    default:
      // Temporary placeholder until the next screens are built.
      return (
        <Group>
          <Badge variant="light">Screen: {state.screen}</Badge>
          <Badge variant="outline">Status: {state.status}</Badge>
          <Button variant="default" onClick={() => dispatch({ type: 'setupReopened' })}>
            Back to setup
          </Button>
        </Group>
      )
  }
}

function App() {
  return (
    <EncounterProvider>
      <Container size="xl" py="xl">
        <Title order={1} fz={50} mb="lg">
          AI Transcription
        </Title>
        <EncounterScreens />
      </Container>
    </EncounterProvider>
  )
}

export default App
