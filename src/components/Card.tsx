import type { ReactNode } from 'react'

interface CardProps {
  // blue = main working area, light = next step / side info (as in the Figma mockups)
  variant: 'blue' | 'light'
  children: ReactNode
  className?: string
}

export function Card({ variant, children, className = '' }: CardProps) {
  return <section className={`card card--${variant} ${className}`}>{children}</section>
}
