import { Stack, Text, UnstyledButton } from '@mantine/core'
import { goToSection } from '../utils/sections'
import { Card } from './Card'

// Section names always come from the displayed headings, so they cannot drift apart.
export function SectionNav({ titles }: { titles: string[] }) {
  return (
    <Card variant="light" className="sections-card">
      <Text className="label" c="var(--color-text-muted)" mb="xs">
        Sections
      </Text>
      <nav aria-label="Sections">
        <Stack gap={2}>
          {titles.map((title) => (
            <UnstyledButton key={title} className="section-link" onClick={() => goToSection(title)}>
              {title}
            </UnstyledButton>
          ))}
        </Stack>
      </nav>
    </Card>
  )
}
