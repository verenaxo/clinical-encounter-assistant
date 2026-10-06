import { Badge, Container, Group, Text, Title } from '@mantine/core'
import { useEncounter } from './encounter/EncounterContext'
import { EncounterProvider } from './encounter/EncounterProvider'

function EncounterScreens() {
  const { state } = useEncounter()

  // Each screen is added here in the following steps.
  return (
    <Group gap="sm" mt="md">
      <Badge variant="light">Screen: {state.screen}</Badge>
      <Badge variant="outline">Status: {state.status}</Badge>
      <Text c="dimmed">Setup screen coming next.</Text>
    </Group>
  )
}

function App() {
  return (
    <EncounterProvider>
      <Container size="xl" py="xl">
        <Title order={1} fz={50}>
          AI Transcription
        </Title>
        <EncounterScreens />
      </Container>
    </EncounterProvider>
  )
}

export default App
