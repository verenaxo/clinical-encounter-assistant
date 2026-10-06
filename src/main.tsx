import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import { theme } from './theme'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // StrictMode (development only) runs some code twice to reveal impure logic and missing cleanup.
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
)
