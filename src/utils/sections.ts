export const sectionId = (title: string) => `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

// Jumps to a section and moves keyboard focus into it (if it has a focus target).
// Instant scroll on purpose: focusing an element cancels a smooth scroll.
export function goToSection(title: string) {
  const section = document.getElementById(sectionId(title))
  section?.scrollIntoView({ block: 'start' })
  section?.querySelector<HTMLElement>('textarea, [tabindex="-1"]')?.focus({ preventScroll: true })
}
