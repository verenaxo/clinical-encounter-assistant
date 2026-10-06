# Clinical Encounter Assistant — prototype

A frontend prototype for prosthetists and orthotists to set up, record, review and finalize a patient encounter. Patients, transcription and AI output are simulated; there is no backend.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Stack: React, TypeScript, Vite, Mantine.

## What is built

- Setup: patient search, encounter type, validation
- Ready: guidance questions (add / remove)
- Recording: simulated transcript, pause / resume, question coverage
- Review: editable transcript, apply notes with undo, section navigation
- Finalized: clinical note / transcript view, .txt download, reopen

## Simulated

- Transcription: a fixed script
- Question coverage: keyword matching
- Apply notes: understands `Replace "x" with "y"`
- Clinical note: pre-written
- Saving: status only, nothing is stored

## Not built

Patient details drawer, quick notes, PDF export, persistence, tests.

## Next steps

- Tests for the reducer and helper functions
- Real speech-to-text and AI behind the same interfaces
- Save encounters so a reload keeps the work
