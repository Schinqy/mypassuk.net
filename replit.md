# Workspace

## Overview

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
- **Institutions** — 57 HE/FE institutions (36 Universities, 11 Colleges, 9 Apprenticeship Providers, 1 Conservatoire). Includes all 24 Russell Group universities, modern/post-1992 universities, specialist arts institutions, FE colleges, and major apprenticeship schemes (BT, Deloitte, PwC, Rolls-Royce, NHS, Google, Channel 4, Network Rail).
- **Institution Detail** — Full detail page for each institution: ranking, 4.5/5 satisfaction with bar, bursaries, international info, notable subjects, facilities, entry requirements, UCAS points, and linked career pathways.
- **Routes** — 25 post-16 and post-18 pathways split by After GCSE and After A-Level. Includes A-Levels, T-Levels, BTECs, Apprenticeships, IB, Access to HE, Scottish Highers, Cambridge Pre-U, EPQ, degree apprenticeships, Fast Stream, Armed Forces, Police DHEP, HNDs, and more.
- **Personalised Quiz** — Multi-step form recommending careers, institutions, and routes. Results include a match score (45-97%), personal message, career cards, institution cards with ranking, and route pathways with pros/cons.
- **About UK Education** — Editorial page covering KS1–KS5, all 6 exam boards, HE fees/finance, FE/apprenticeships, and full RQF qualifications framework.
- **AI Study Assistant** — Global floating chat panel (bottom-right) powered by OpenAI (gpt-5.2). On subject detail pages, automatically receives subject-specific context (name, level, category, key topics) via React Context. Supports streaming SSE responses, quick-prompt buttons, new-conversation reset, and persists all messages to the `conversations` + `messages` DB tables. Uses raw `fetch` + `ReadableStream` (NOT Orval-generated hooks).

### Database Tables
- `subjects` — GCSE and A-Level subject data (55 subjects)
- `careers` — Career profiles with salary, required subjects, and pathways (69 careers)
- `institutions` — HE and FE institutions with filters (57 institutions)
- `routes` — Post-16 and post-18 routes with pros/cons (25 routes)
- `conversations` — AI chat session records (id, title, createdAt)
- `messages` — Individual chat messages (id, conversationId, role, content, createdAt)

### Scripts
```bash
pnpm --filter @workspace/scripts run seed          # Full reseed (deletes all data)
pnpm --filter @workspace/scripts run update-resources  # Update subject resource URLs only
pnpm --filter @workspace/scripts run expand-data   # Add new institutions/careers/routes (safe, no deletes)
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

Express 5 API server. Routes: `/api/healthz`, `/api/subjects`, `/api/careers`, `/api/institutions`, `/api/routes`, `/api/quiz/recommend`, `/api/openai/conversations` (CRUD + SSE streaming)

### `artifacts/uk-education-guide` (`@workspace/uk-education-guide`)

React + Vite frontend at preview path `/`. Pages: Home, Subjects, SubjectDetail, Careers, CareerDetail, Institutions, Routes, Quiz.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Tables: subjects, careers, institutions, routes.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
