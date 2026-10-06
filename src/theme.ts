import { createTheme, type MantineColorsTuple } from '@mantine/core'

// Shades of the Figma "Primary" variable (#0068B8 is index 6, Mantine's default primary shade).
const brand: MantineColorsTuple = [
  '#e6f0f8',
  '#cce1f1',
  '#99c3e3',
  '#66a4d4',
  '#3386c6',
  '#1a77bf',
  '#0068b8',
  '#005ea6',
  '#004e8c',
  '#003e70',
]

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand },
  black: '#121317',
  white: '#fefefe',
  fontFamily: 'Manrope, system-ui, sans-serif',
  headings: { fontFamily: 'Manrope, system-ui, sans-serif', fontWeight: '400' },
  defaultRadius: 'md',
  radius: { md: '14px', lg: '24px' },
})
