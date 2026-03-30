# Workspace

## Overview

**Live app:** [https://exam-navigator-MatthewNyamasok.replit.app](https://exam-navigator-MatthewNyamasok.replit.app)

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── uk-education-guide/ # React + Vite UK Education & Career Guide frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   └── src/seed.ts         # Database seeding script
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## UK Education & Career Guide

A data mining tool for UK GCSE and A-level students helping them prepare for exams and explore career paths.

### Features
- **Exam Preparation** — 55 subjects (GCSE & A-Level) with study tips, key topics, exam boards, and 4-8 verified resources each
- **Career Explorer** — 69 career profiles across 10 sectors: Healthcare, Technology, Engineering, Law, Finance, Education, Creative Arts, Science, Business, and Public Services. Each has salary ranges, day-in-the-life, entry routes, and workplaces.
- **Institutions** — 267 HE/FE institutions (122 Universities, 111 Colleges, 33 Apprenticeship Providers, 1 Conservatoire). Covers all 24 Russell Group universities plus ~98 other universities, 100 major FE colleges across all four UK nations (England, Scotland, Wales, Northern Ireland), and 33 major apprenticeship providers.
- **Institution Detail** — Full detail page for each institution: ranking, 4.5/5 satisfaction with bar, bursaries, international info, notable subjects, facilities, entry requirements, UCAS points, and linked career pathways.
- **Routes** — 25 post-16 and post-18 pathways split by After GCSE and After A-Level. Includes A-Levels, T-Levels, BTECs, Apprenticeships, IB, Access to HE, Scottish Highers, Cambridge Pre-U, EPQ, degree apprenticeships, Fast Stream, Armed Forces, Police DHEP, HNDs, and more.
- **Personalised Quiz** — Multi-step form recommending careers, institutions, and routes. Results include a match score (45-97%), personal message, career cards, institution cards with ranking, and route pathways with pros/cons.
- **About UK Education** — Editorial page covering KS1–KS5, all 6 exam boards, HE fees/finance, FE/apprenticeships, and full RQF qualifications framework.
- **AI Study Assistant** — Global floating chat panel (bottom-right) powered by OpenAI (gpt-5.2). On subject detail pages, automatically receives subject-specific context (name, level, category, key topics) via React Context. Supports streaming SSE responses, quick-prompt buttons, new-conversation reset, and persists all messages to the `conversations` + `messages` DB tables. Uses raw `fetch` + `ReadableStream` (NOT Orval-generated hooks). **Tiered daily message limits**: anonymous=5/day, signed-in free=15/day, Premium=unlimited. Paywall for anonymous users offers a "Sign in for 15/day" option alongside Upgrade.

### Database Tables
- `subjects` — GCSE and A-Level subject data (55 subjects)
- `careers` — Career profiles with salary, required subjects, and pathways (69 careers)
- `institutions` — HE and FE institutions with filters (267 institutions)
- `routes` — Post-16 and post-18 routes with pros/cons (25 routes)
- `conversations` — AI chat session records (id, title, createdAt)
- `messages` — Individual chat messages (id, conversationId, role, content, createdAt)
- `saved_subjects` — User-saved subjects (userId + subjectId unique pair, savedAt timestamp)

### Scripts
```bash
pnpm --filter @workspace/scripts run seed              # Full reseed (deletes all data)
pnpm --filter @workspace/scripts run update-resources  # Update subject resource URLs only
pnpm --filter @workspace/scripts run expand-data       # Add new institutions/careers/routes (safe, no deletes)
pnpm --filter @workspace/scripts run add-apprenticeships  # Add 33 apprenticeship providers (idempotent)
pnpm --filter @workspace/scripts run add-he-fe         # Add ~186 universities + colleges (idempotent)
pnpm --filter @workspace/scripts run update-alerts     # Refresh institution recruitment alerts
pnpm --filter @workspace/scripts run deploy-seed       # Production seed (safe, runs on deploy)
```

### Exam Board Standardisation
All exam board references use "Pearson Edexcel" (not plain "Edexcel").

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes: `/api/healthz`, `/api/subjects`, `/api/careers`, `/api/institutions`, `/api/routes`, `/api/quiz/recommend`, `/api/openai/conversations` (CRUD + SSE streaming). Institutions sorted featured-first.

### `artifacts/uk-education-guide` (`@workspace/uk-education-guide`)

React + Vite frontend at preview path `/`. Pages: Home, Subjects, SubjectDetail, Careers, CareerDetail, Institutions, Routes, Quiz, Timetable, Pricing.

**Monetisation features:**
- `featured: boolean` column on `institutions` table — 7 institutions marked featured (Manchester, Edinburgh, KCL, Leeds City College, Rolls-Royce, BAE Systems, City University of London)
- Featured institutions float to the top of the Institutions list with an amber "FEATURED" badge
- "Advertise with us" CTA at bottom of institutions list links to Pricing page
- AI Study Assistant freemium gate: 5 messages/day (tracked in localStorage, key `ai-chat-daily-YYYY-MM-DD`), upgrade prompt shown when limit reached
- Pricing page at `/pricing` with Free / Student Premium (£3.99/mo) / Institution Featured (£99/mo) tiers
- "Pricing" link in Navbar (amber colour to stand out)
- **Stripe payments** (Sandbox): "Start 7-day free trial" button on Pricing page calls `POST /api/stripe/checkout` and redirects to Stripe Checkout. Checkout success lands at `/checkout/success`, cancel at `/checkout/cancel`. Anonymous userId stored in localStorage (`uk-edguide-user-id`).

### Stripe Integration
- **Connection**: Replit Stripe connector (`connection:conn_stripe_01KMRGMHX6ASF7SF1FBBWS48WP`), sandbox mode
- **Products**: `prod_UE9btI7CAGukOd` — "Student Premium"; Monthly: `price_1TFhHuADJ1aNg2Ze5IaF8u5g` (£3.99/mo), Annual: `price_1TFhHuADJ1aNg2ZenHaX3ZNh` (£35.88/yr)
- **Stripe schema**: 29 tables in `stripe.*` schema (accounts, customers, subscriptions, prices, products, etc.) managed by `stripe-replit-sync`
- **Webhook**: Auto-registered at `/api/stripe/webhook` (raw body, before express.json()) via `findOrCreateManagedWebhook`
- **Stripe migrations**: Must be run OUTSIDE the compiled bundle — use `node --input-type=module -e "import {runMigrations} from 'stripe-replit-sync'; await runMigrations({databaseUrl: process.env.DATABASE_URL});"` (bundle can't locate SQL files)
- **API routes**: `GET /api/stripe/config`, `POST /api/stripe/checkout`, `GET /api/stripe/subscription/:userId`, `POST /api/stripe/portal`
- **Key files**: `artifacts/api-server/src/stripeClient.ts`, `stripeService.ts`, `storage.ts`, `webhookHandlers.ts`, `routes/stripe.ts`
- **Seed script**: `pnpm --filter @workspace/scripts run seed-products`

### Authentication (Replit Auth)

Full OIDC-based authentication using Replit Auth with PKCE flow.

- **Session cookie**: `sid` (httpOnly, secure, sameSite=lax, 7-day TTL)
- **Login**: `GET /api/login` → Replit OIDC → `GET /api/callback` → sets sid cookie → redirects home
- **Logout**: `GET /api/logout` → deletes session → Replit end-session URL → redirects home
- **Auth status**: `GET /api/auth/user` → `{ user: AuthUser | null }`
- **Account info**: `GET /api/account` (requires auth) → user profile + subscription status
- **Middleware**: `authMiddleware` runs on every request, populates `req.user`, handles token refresh
- **Sessions table**: `sessions` (sid, sess jsonb, expire)
- **DB users table**: Extended with firstName, lastName, profileImageUrl, updatedAt, subscriptionStatus, subscriptionPlan, currentPeriodEnd
- **Frontend hook**: `useAuth()` from `@workspace/replit-auth-web` — provides user, isAuthenticated, login(), logout()
- **Account page**: `/account` — profile, plan & billing, saved subjects (bookmark list), nation preference, sign out
- **Navbar**: shows user avatar (link → /account) when authenticated, "Sign in" button when not
- **Key files**: `artifacts/api-server/src/lib/auth.ts`, `middlewares/authMiddleware.ts`, `routes/auth.ts`, `routes/account.ts`, `lib/replit-auth-web/`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Tables: subjects, careers, institutions, routes, users (id, email, firstName, lastName, profileImageUrl, stripeCustomerId, stripeSubscriptionId, subscriptionStatus, subscriptionPlan, currentPeriodEnd, updatedAt), sessions (for auth), promo-codes, conversations, messages, saved_subjects (userId + subjectId unique, savedAt).

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
