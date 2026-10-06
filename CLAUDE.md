# CLAUDE.md

Interview case prototype (Design Engineer role): a clinical encounter assistant for prosthetists and orthotists. Frontend only, all data and AI simulated. Timeboxed; keep changes minimal and prototype-level.

## Commands

- `npm run dev` — dev server on http://localhost:5173
- `npm run build` — type-check (`tsc -b`) and build; run before committing
- `npm run lint` — ESLint (incl. react-hooks rules); must stay clean

## Stack

React 19, TypeScript, Vite, Mantine 9 (`@mantine/core`, `@mantine/hooks`), `@tabler/icons-react`. No router, no state library, no test setup. Ask before adding dependencies.

Mantine 9 note: some props differ from older docs (e.g. `Grid` uses `gap`, not `gutter`). Check the installed types when unsure.

## Sources of truth

- Content, interactions and states: the `clinical-encounter-ui` skill.
- Layout: Figma file `N6F9QVIkQTWvfZeSr4C4qr` (page "Mockup": 01 Setup … 05 Finalized, plus "05 Finalized — Transcript").
- Visual style: Figma Style page. Primary `#0068B8` (theme color `brand`), black `#121317`, fonts Manrope (content) and Space Grotesk (labels). Tokens in `src/theme.ts` and `src/index.css`.
- Do not create or modify Figma frames unless asked.

## Structure

- `src/encounter/` — state and logic: `types.ts`, `encounterReducer.ts` (state machine), `EncounterContext.ts` / `EncounterProvider.tsx`, hooks (`useSimulatedRecording`, `useAutosave`), pure helpers (`coverage.ts`, `applyNotes.ts`)
- `src/screens/` — one component per screen; `App.tsx` switches on `state.screen`
- `src/components/` — shared UI (`Card` with `blue` / `light` variants, `CardTitle`, `GuidanceQuestions`, `SectionNav`, `EncounterHeader`)
- `src/data/` — mock patients, guidance questions (with coverage keywords), transcript script, SOAP note
- `src/utils/` — small helpers (time format, section scrolling, .txt download)

## Conventions

- **State machine:** every action is listed in `ALLOWED_FROM` with the statuses it may run from; disallowed actions are ignored. Add new actions there.
- **Keep screen, encounter status and save status separate.** Save status lives in `useAutosave`, not in the reducer. Incomplete setup is status `draft`, never "Ready".
- **The generated note is separate** from the transcript and never replaces it.
- **Accessibility:** visible labels, semantic buttons/radios, `aria-label` on icon buttons, status as text (not colour alone).
- **Scrolling to sections is instant on purpose:** focusing a textarea cancels a smooth scroll in Chrome.

## Scope decisions

- Built: all 9 prioritised features (see README "Priorities").
- Simulated: transcription script, keyword-based coverage, one-pattern "Apply notes", pre-written SOAP note, save status only.
- Not built: patient details drawer, quick notes, fitting measurements, PDF export, persistence, tests, design details.
- Stop and Pause are one button (same behaviour). Download is .txt only.

## Git

This project has its own repository. Always run git commands from this project folder, never from a parent directory.
