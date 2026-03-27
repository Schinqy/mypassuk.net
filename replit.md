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
- **Exam Preparation** — 18 subjects (GCSE & A-Level) with study tips, key topics, exam boards, and resources
- **Career Explorer** — 14 career profiles across Healthcare, Technology, Engineering, Law, Finance, Education, Creative Arts, and Science
- **Institutions** — 15 HE/FE institutions including Russell Group universities, modern universities, colleges, conservatoires, and apprenticeship providers
- **Routes** — 11 post-16 and post-18 pathways (A-Levels, T-Levels, BTECs, Apprenticeships, IB, Gap Year, etc.)
- **Personalised Quiz** — Multi-step form that recommends careers, institutions, and routes based on subjects, grades, and interests

### Database Tables
- `subjects` — GCSE and A-Level subject data
- `careers` — Career profiles with salary, required subjects, and pathways
- `institutions` — HE and FE institutions with filters
- `routes` — Post-16 and post-18 routes with pros/cons

### Re-seeding
```bash
pnpm --filter @workspace/scripts run seed
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes: `/api/healthz`, `/api/subjects`, `/api/careers`, `/api/institutions`, `/api/routes`, `/api/quiz/recommend`

### `artifacts/uk-education-guide` (`@workspace/uk-education-guide`)

React + Vite frontend at preview path `/`. Pages: Home, Subjects, SubjectDetail, Careers, CareerDetail, Institutions, Routes, Quiz.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Tables: subjects, careers, institutions, routes.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
