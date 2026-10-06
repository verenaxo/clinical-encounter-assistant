import type { ReactNode } from 'react'
import { Group, Title } from '@mantine/core'

export function CardTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Group gap="sm">
      <span className="icon-tile">{icon}</span>
      <Title order={2} fz={18} fw={400}>
        {children}
      </Title>
    </Group>
  )
}
