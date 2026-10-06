# Clinical Encounter Assistant — prototype

A frontend prototype for prosthetists and orthotists to set up, record, review and finalize a patient encounter. Patients, transcription and AI output are simulated; there is no backend.

The visual design (flows, mockups, variants) lives in Figma. This prototype focuses on the interaction logic behind it.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Stack: React, TypeScript, Vite, Mantine. No router or state library: screens come from the encounter state, and `useReducer` + Context is enough.

## Flow

Setup → Ready → Recording ⇄ Paused → Review ⇄ Finalized

## Priorities

With about 2 hours for development, features were ranked by how much they show React skills beyond layout, and how directly they address the brief (focus during the encounter, insurance compliance, admin work after the visit).

| Priority | Feature |
|---|---|
| 1 | One encounter state machine with only allowed transitions; screen, encounter status and save status kept separate |
| 1 | Shared encounter state for every screen (Context provider) |
| 1 | Question coverage tracking during recording ("X of 4 covered", what is still missing) |
| 2 | Setup validation with focus on the first invalid field |
| 3 | Patient search (recent patients, then A–Z results, empty state) |
| 3 | Autosave status ("Saving…" → "Saved") |
| 3 | Review: editable transcript, apply notes with undo, section navigation |
| 4 | Simulated recording hook (timer, streaming transcript, pause/resume that appends) |
| 5 | .txt download |

All of them are built.

## Simulated

- Transcription: a fixed 9-line script, the same for every encounter type
- Question coverage: keyword matching stands in for the AI
- Apply notes: understands one instruction, `Replace "x" with "y"`
- Clinical note: a pre-written SOAP note, shown separately from the transcript
- Saving: status only, nothing is stored (a reload starts over)

## Trade-offs

- **Logic first, design from Figma.** The mockups already show the visual design, so the prototype reuses two card styles (blue for working areas, light for next steps) instead of matching every screen pixel for pixel.
- **Not every screen is built in full.** Setup, Recording and Review are complete; Ready and Finalized are kept thin.
- **No separate Stop button.** Stopping and pausing behave the same (both keep the transcript), so one Pause button avoids two buttons doing the same thing.
- **Transcript split into editable sections** instead of one text box, so the sections list can jump to each heading while native text editing still works.
- **Undo disappears after manual edits**, because undoing would also discard what was typed.
- **Questions added by the clinician are not tracked** for coverage, since the simulated AI has no keywords for them.
- **.txt only.** One format that really works rather than a menu of unimplemented ones.

## Not built

Shown in Figma or the brief, but left out: patient details drawer, quick notes, fitting measurement fields, PDF export, persistence, tests.

## Next steps

- Tests for the reducer and helper functions (all pure, so quick to add)
- Real speech-to-text and AI behind the same interfaces
- Save encounters so a reload keeps the work
- Test the recording screen with clinicians: is guidance glanceable while their hands are busy?
