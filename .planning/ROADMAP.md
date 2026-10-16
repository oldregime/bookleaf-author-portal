# BookLeaf Author Support & Communication Portal
**Milestone:** 1.0.0
**Status:** In Progress
**Branch:** `main`

## Phase Roadmap

### Phase 1: Foundation & Data Modeling (Seeding & RBAC)
- **Status:** Pending
- **Goal:** Project setup (Next.js 15, TypeScript, Tailwind, Prisma with SQLite), seed script importing exact `bookleaf_sample_data.json` records, authentication schema and JWT verification for Author vs Admin roles.

### Phase 2: Core REST API & Real-Time Engine (SSE)
- **Status:** Pending
- **Goal:** REST endpoints for authors (books, tickets, reply) and admins (ticket queue, override, reply, internal notes), Server-Sent Events (SSE) stream for instant zero-refresh ticket updates.

### Phase 3: AI Classification & Knowledge-Base Draft Engine
- **Status:** Pending
- **Goal:** AI classification into 6 official BookLeaf categories, severity priority scoring (Critical/High/Medium/Low), BookLeaf Knowledge Base grounding for empathetic draft generation, graceful fallback on rate limits or API downtime.

### Phase 4: Author & Admin Dashboards (Modern UI/UX)
- **Status:** Pending
- **Goal:** Author Portal (My Books overview, ticket submission, live conversation thread) and Admin Command Center (filtering pills, aging/urgent alerts, side-by-side draft editor, admin overrides, internal notes).

### Phase 5: IP Protection, Recruiter Telemetry & Legal Notice
- **Status:** Pending
- **Goal:** Custom Non-Commercial Evaluation License and silent evaluator visit beacon notifying the engineer via webhook/email on recruiter inspection.

### Phase 6: Production Packaging, Live Testing & SDE Documentation
- **Status:** Pending
- **Goal:** Automated tests, OpenAPI/Swagger docs, comprehensive SDE-grade README with credentials, and 1-page executive architecture write-up.
