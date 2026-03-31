# GT Challenge: A Test You Can Game

## What This Is
An adaptive gifted assessment platform that embraces gameability as a feature. Measures both **aptitude** (cognitive ability via IRT-calibrated adaptive items) and **appetite** (learning drive via behavioral signals: persistence, voluntary difficulty escalation, cross-session learning velocity).

## Stack
- TypeScript/Next.js monorepo (workspaces: `apps/*`, `packages/*`)
- Supabase backend (auth, database, edge functions)
- IRT (Item Response Theory) engine as a standalone package

## Monorepo Structure
```
apps/
  web/                    # Next.js app (App Router)
    src/app/(auth)/       # Login, signup, callback
    src/app/demo/         # Demo assessment page
    src/app/session/      # Live assessment sessions
    src/app/parent/       # Parent dashboard, child profiles
    src/components/       # UI components
    src/stores/           # Auth and session state (Zustand)
    src/lib/              # Supabase client helpers

packages/
  irt-engine/             # Core adaptive testing math
    src/model.ts          # 3PL IRT model, Fisher information
    src/estimation.ts     # EAP theta estimation, standard error
    src/item-selection.ts # Next item selection algorithm
    src/termination.ts    # Session termination rules
    src/cross-session.ts  # Cross-session theta, composite scores
    src/__tests__/        # Unit tests for all modules
  shared-types/           # Enums, Zod schemas, shared TypeScript types
  supabase-client/        # Supabase browser + server client wrappers

supabase/
  migrations/             # Database schema
  functions/              # Edge functions (start-session, compute-next-item)
  seed.sql                # Seed data
```

## Key Design Decisions
- IRT engine is a pure TypeScript package with no framework dependencies — can run server-side or client-side
- 3-Parameter Logistic (3PL) model accounts for guessing
- EAP (Expected A Posteriori) estimation for theta — more stable than MLE with few responses
- Cross-session tracking: `computeStartingTheta()` uses prior sessions to set initial ability estimate
- Appetite signals are behavioral, not self-reported — measured through what students actually do

## Running Locally
```bash
npm install
npm run dev          # starts Next.js dev server
npm run test         # runs IRT engine tests
```

## Research Foundation
- `BRAINLIFT_PRD.md` — 70+ page research document covering psychometric evidence, 10 domain experts, spiky POVs on gifted testing
- `BRAINLIFT_COGAT_DEFENSE.md` — CogAT comparison and defense of approach
- `EVALUATION_FRAMEWORK.md` — Testing/evaluation criteria

@apps/web/CLAUDE.md
