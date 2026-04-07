# GT Challenge — Project Overview

**An adaptive gifted assessment that measures both cognitive ability and learning drive.**

Live: https://main.d1ft6a4fdhj1nr.amplifyapp.com
Repo: https://github.com/supe-log/gt-challenge

---

## What It Is

GT Challenge is a multi-session adaptive assessment platform for identifying gifted students (grades K-8). Unlike traditional tests like CogAT that happen once and are coachable, GT Challenge measures two things:

- **Aptitude** — Cognitive ability via IRT-calibrated adaptive items across reasoning, math, verbal, and pattern recognition
- **Appetite** — Learning drive via behavioral signals: does the child come back, persist after mistakes, opt into harder challenges?

The only way to "game" the test is to keep learning — which is exactly the signal we want.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | 16.2.0 |
| UI Framework | React | 19.2.4 |
| Styling | Tailwind CSS | 4 |
| Animation | Framer Motion | 12.38.0 |
| Components | shadcn + Base UI | — |
| Icons | Lucide React | 0.577.0 |
| State Management | Zustand | 5.0.12 |
| Backend | Supabase (Auth, DB, Edge Functions) | — |
| Database | PostgreSQL | 17 |
| Psychometrics | Custom IRT Engine (3PL model) | — |
| Testing | Vitest | 2.1.9 |
| QA Pipeline | Claude API + OpenAI API (Karpathy Loops) | — |
| Deployment | AWS Amplify | — |
| Language | TypeScript | 5 |

---

## Frontend Architecture

### Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Landing page with hero, features, CTAs |
| `/demo` | Public | Interactive demo — full adaptive session, no login needed |
| `/login` | Public | Email/password sign in |
| `/signup` | Public | Create parent account |
| `/forgot-password` | Public | Password reset via email |
| `/callback` | Public | Supabase auth callback handler |
| `/parent` | Protected | Parent dashboard — child cards, session counts, scores |
| `/parent/children/[id]` | Protected | Child detail — session history, aptitude + appetite scores, progress chart |
| `/session/[id]` | Protected | Live adaptive assessment session |

### State Management (Zustand)

- **useAuthStore** — User authentication state, parent profile, sign out
- **useSessionStore** — Active session state: current item, theta, scores, loading. Calls edge functions via `supabase.functions.invoke()`

### Key UI Components

- **Session page** — Mountain level indicator, domain badges, streak counter, progress bar, answer options with color-coded feedback, bonus round modals, idle detection
- **Parent dashboard** — Child cards with avatar initials, session counts, aptitude level labels
- **Child detail** — Aptitude + appetite score cards, SVG progress chart, session history table with all metrics
- **Add child form** — Name + age band selector, creates child profile + parent link + PII record

### Middleware

Auth middleware protects `/parent/*` and `/session/*` routes. Redirects unauthenticated users to `/login`. Redirects authenticated users away from auth pages.

---

## Backend Architecture

### Supabase Edge Functions

**`start-session`**
1. Verifies parent-child link via auth token
2. Abandons any active sessions for the child
3. Computes starting theta from prior session (90% carryover)
4. Selects first item using Maximum Fisher Information at starting theta
5. Creates session + response records
6. Returns: session_id, first item, session number

**`compute-next-item`**
1. Scores the response (answer_index vs correct_index)
2. Computes current theta via EAP (Expected A Posteriori) estimation
3. Checks termination: `MIN_ITEMS=20`, `MAX_ITEMS=40`, `SE_TARGET=0.25`, `MAX_TIME=35min`
4. If terminating: computes composite score + appetite signals
5. If continuing: selects next item with content balancing
   - Fisher Information at current theta
   - Domain balance: hard cap at 30%, soft penalty at 25%
   - Consecutive same-domain penalty
   - Weighted random from top 3 candidates

### Database Schema (8 tables)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | Parents + children (children have no auth user — COPPA) | role, display_name, age_band, auth_user_id |
| `parent_child_links` | Parent-child relationships | parent_id, child_id, relationship |
| `child_pii` | Isolated PII (COPPA) | full_name, date_of_birth |
| `items` | 334 IRT-calibrated assessment items | domain, difficulty, discrimination, guessing, content_json, age_bands |
| `sessions` | Assessment sessions with theta tracking | starting_theta, terminal_theta, terminal_se, status |
| `responses` | Per-item responses | answer_given, is_correct, time_on_item_ms, idle_time_ms |
| `appetite_signals` | 6 behavioral signal types | signal_type, signal_value (0-1) |
| `composite_scores` | Aggregated aptitude + appetite results | aptitude_theta, aptitude_tier, appetite_score, appetite_tier |

### Row-Level Security

9 RLS policies ensure parents see only their children's data. Child profiles have no auth_user_id (COPPA compliance). Parent-child link verification on all protected queries.

---

## How It Works: End-to-End

```
Parent signs up (email/password)
  → Supabase Auth creates user
  → profiles row created (role=parent)

Parent adds child
  → profiles row (role=child, no auth_user_id)
  → parent_child_links row
  → child_pii row (isolated)

Child starts session
  → Edge: start-session
    → Verify parent-child link
    → Compute starting theta (0 or 90% of prior terminal theta)
    → Select first item (max Fisher Information)
    → Return item + session_id

Child answers question
  → Edge: compute-next-item
    → Score response
    → EAP theta estimation from all responses
    → Check termination (SE ≤ 0.25 after 20+ items, or 40 max, or 35 min)
    → Select next item (Fisher Info + domain balance + top-3 random)
    → Loop until termination

Session ends
  → Composite score: weighted theta across sessions (λ=0.7 decay)
  → Appetite signals: 6 behavioral metrics computed
  → Parent sees results on dashboard
```

---

## Item Bank

**334 total items** across all 12 domain × age band combinations:

| Domain | K-2 | 3-5 | 6-8 | Total |
|--------|-----|-----|-----|-------|
| Reasoning | 21 | 103 | 20 | 144 |
| Math | 23 | 19 | 23 | 65 |
| Verbal | 15 | 23 | 16 | 54 |
| Pattern Recognition | 29 | 21 | 21 | 71 |
| **Total** | **88** | **166** | **80** | **334** |

103 items were generated and approved via the Karpathy Loops QA pipeline with a 90/100 quality threshold and 3 critical gates (content accuracy, cognitive depth, distractor quality).

---

## QA Pipeline (Karpathy Loops)

Adapted from the mw-autoqa pattern. Frozen evaluators + mutable generators + ratchet.

### Frozen Components (don't change)
- `qa/evaluate-item.ts` — 8-dimension scoring rubric (100pts, 3 critical gates)
- `qa/schemas/` — item-schema, domain-taxonomy, grade-specs, misconception-library

### Mutable Components (iterate against evaluators)
- `qa/generate-items.ts` — Claude API item generation
- `qa/generate-edit.ts` — Surgical edits based on revision deltas

### Orchestration
- `qa/run-micro-loops.sh` — Generate → Evaluate → Route deltas → Edit → Re-evaluate → Ratchet
- `qa/run-pipeline.sh` — All 12 domain × age band combinations
- `qa/seed-approved.ts` — Approved items → Supabase SQL + demo items

### Quality Dimensions (100pts total)

| Dimension | Points | Critical? |
|-----------|--------|-----------|
| Cognitive Depth | 20 | Yes |
| Distractor Quality | 20 | Yes |
| Content Accuracy | 15 | Yes |
| Age Appropriateness | 10 | No |
| Stem Clarity | 10 | No |
| Domain Alignment | 10 | No |
| Bias & Sensitivity | 10 | No |
| IRT Parameter Validity | 5 | No |

---

## Feature Status

### Built
- [x] Adaptive IRT engine (3PL model, EAP estimation, 32 tests passing)
- [x] 334 items across 4 domains × 3 age bands
- [x] Karpathy Loops QA pipeline (90/100 threshold)
- [x] Parent auth + child profiles (COPPA-compliant)
- [x] Live session UI (streaks, levels, bonus rounds, idle detection)
- [x] Parent dashboard (aptitude + appetite scores, progress charts)
- [x] 6 appetite signals (persistence, return visits, voluntary hard, learning velocity, time investment, streak)
- [x] Cross-session theta tracking (λ=0.7 decay)
- [x] Edge functions deployed (start-session, compute-next-item)
- [x] Demo mode (no auth, full IRT engine, all age bands)
- [x] Deployed to AWS Amplify (auto-build on push)
- [x] Security headers (XFO, nosniff, referrer policy)
- [x] Forgot password flow
- [x] Global error boundary

### Needs Work
- [ ] Privacy policy + Terms of Service pages
- [ ] COPPA parental consent verification flow
- [ ] Item exposure counting (Sympson-Hetter control)
- [ ] More math + verbal items (bank imbalanced)
- [ ] Custom email templates
- [ ] Error monitoring (Sentry)
- [ ] Mobile polish on parent dashboard
- [ ] Custom domain

---

## Developer Setup

```bash
# Clone
git clone https://github.com/supe-log/gt-challenge
cd gt-challenge

# Install
npm install

# Configure environment
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://oddzldjpmwvcojjisnzl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
EOF

# Run
npm run dev          # http://localhost:3000
npm run test         # 32 IRT + 7 appetite tests
npm run build        # production build

# QA pipeline (requires API keys)
ANTHROPIC_API_KEY=... OPENAI_API_KEY=... bash qa/run-pipeline.sh

# Deploy edge functions
supabase functions deploy start-session --no-verify-jwt
supabase functions deploy compute-next-item --no-verify-jwt
```

### Monorepo Structure

```
apps/
  web/                    # Next.js 16 app
    src/app/              # App Router pages
    src/components/       # UI components
    src/stores/           # Zustand stores
    src/lib/              # Supabase client helpers

packages/
  irt-engine/             # IRT math (3PL, EAP, Fisher info)
  appetite-engine/        # Behavioral signal computation
  shared-types/           # Enums, Zod schemas
  supabase-client/        # Browser + server Supabase wrappers

supabase/
  migrations/             # 7 migration files (schema + seeds)
  functions/              # Edge functions (Deno)

qa/                       # Karpathy Loops QA pipeline
  schemas/                # Frozen evaluation schemas
  approved/               # 103 QA-approved items
  evaluate-item.ts        # Frozen evaluator (8 dimensions)
  generate-items.ts       # Claude-powered generator
  run-micro-loops.sh      # Orchestration
```

---

## Known Issues

1. **Item exposure counting not implemented** — `compute-next-item/index.ts:153` has a TODO for Sympson-Hetter control. Items may be over-exposed until this is added.
2. **Appetite engine duplicated** — The appetite signal computation is inlined in the edge function rather than using the `appetite-engine` package. Should centralize.
3. **Item bank imbalanced** — Reasoning has 144 items vs Math's 65 and Verbal's 54. Run more QA pipeline batches for underrepresented domains.
4. **Demo mode IRT math duplicated** — The demo page inlines IRT functions from the `irt-engine` package for client-side execution. Intentional (no backend needed for demo) but adds maintenance overhead.
