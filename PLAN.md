# BookLeaf Publishing - Author Support & Communication Portal
## Master Architecture & Implementation Plan (SDE Level)

---

### Executive Overview & Strategic Intent
This system solves BookLeaf's acute scaling pain: managing communication across 1,200+ monthly published titles and thousands of authors inquiring about royalties, print quality, ISBNs, and distribution.

The goal of this solution is twofold:
1. **Flawless SDE-Grade Execution**: Full adherence to BookLeaf's assignment requirements (Author Portal, Admin Portal, AI Auto-Classification, Priority Scoring, Knowledge-Base Grounded Draft Responses, Real-Time updates, Seeding from `bookleaf_sample_data.json`).
2. **IP Protection & Recruiter Telemetry (Silent Beacon & Custom Licensing)**: Protect intellectual property while obtaining telemetry (visit timestamps, IP/user-agent, viewed sections) dispatched directly to your personal webhook/email without degrading user experience or triggering ad-blockers.

---

### 🧘 Architectural Philosophy: The "Ponytail" Ladder
Following the **Lazy Senior Developer** philosophy:
- **No wrapper bloat**: Zero premature abstraction layers. Direct, clean, idiomatic architecture.
- **Native platform primitives**: Native `fetch`, native `crypto.randomUUID()`, native WebSockets / SSE, native SQL queries and clean ORM/query builder.
- **High Signal-to-Noise Ratio**: Production-quality code with 100% test coverage for core business logic (royalty computation, ticket state machines, prompt engineering, RBAC).

---

### 🏗️ Proposed System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │               Client Browser                 │
                    │   (Author Portal  |  Admin Command Center)   │
                    └───────────────┬──────────────────────────────┘
                                    │ HTTPS / WSS
                                    ▼
       ┌─────────────────────────────────────────────────────────────────┐
       │             Unified Full-Stack App (Next.js / Node)              │
       │                                                                 │
       │  ┌──────────────────────┐      ┌─────────────────────────────┐  │
       │  │  Author / Admin UI   │      │  Secure REST & SSE Engine   │  │
       │  │  (Tailwind, Radix)   │      │  (RBAC, JWT, Input Schemas) │  │
       │  └──────────────────────┘      └──────────────┬──────────────┘  │
       │                                               │                 │
       │  ┌──────────────────────┐      ┌──────────────┴──────────────┐  │
       │  │ Recruiter Telemetry  │      │ AI Prompt Engine (LLM)      │  │
       │  │ (Silent Visit Beacon)│      │ Grounded in BookLeaf KB     │  │
       │  └──────────┬───────────┘      └──────────────┬──────────────┘  │
       └─────────────┼─────────────────────────────────┼─────────────────┘
                     │                                 │
           ┌─────────▼──────────┐            ┌─────────▼──────────────┐
           │ Telemetry Webhook  │            │ LLM API                │
           │ (Email/Telegram)   │            │ (Gemini 2.5 Flash /    │
           │                    │            │  Claude Haiku)         │
           └────────────────────┘            └────────────────────────┘
```

---

### 🛡️ Anti-Theft, Licensing & Recruiter Telemetry Strategy

1. **Proprietary Source License (`LICENSE.md`)**:
   - Explicit **Non-Commercial Evaluative Use Only** license:
   - *"This repository is strictly for candidate evaluation by BookLeaf Publishing. Any extraction, commercial use, modification, or inclusion in proprietary systems without written consent is expressly prohibited."*
2. **Passive Recruiter Telemetry (Silent Visitor Beacon)**:
   - A lightweight, unobtrusive server-side ping endpoint (`/api/telemetry/beacon` or Next.js middleware) that logs:
     - Timestamp
     - IP Address & Geo-location (via headers like `x-forwarded-for`, `cf-ipcountry`)
     - User-Agent (browser/device)
     - Referral source / path explored (Author Portal vs Admin Portal vs AI Drafts)
   - Immediately dispatches a lightweight alert (via Telegram Bot Webhook / Resend Email API) notifying you:
     - *"🎯 Recruiter/Evaluator just opened the live demo from [Location] inspecting the Admin Portal!"*
3. **Graceful Fallbacks & Anti-Circumvention**:
   - The beacon runs async/fire-and-forget so that if network or ad-blockers block it, the app functions with 0 delay or errors.

---

### 📋 Phase-by-Phase Roadmap

#### Phase 1: Foundation & Data Modeling (Seeding & RBAC)
- **Data Engine**: SQLite (via Prisma or Drizzle) for seamless zero-setup local running and one-click cloud deployment.
- **Schema**:
  - `Author`: credentials, name, email, phone, city, bank details status.
  - `Book`: author relation, title, isbn, genre, publication date, status, MRP, sales, royalties (earned, paid, pending), print partner, platforms.
  - `Ticket`: author relation, book relation, subject, description, category, priority, status (`Open`, `In Progress`, `Resolved`, `Closed`), internal notes, assigned admin.
  - `TicketMessage`: ticket relation, sender type (`author` | `admin`), content, attachments placeholder, created_at.
- **Seed Script**: Exact 1-to-1 import of `bookleaf_sample_data.json` with pre-configured demo logins:
  - Admin: `admin@bookleafpub.com` / `bookleaf2026`
  - Author 1 (Priya Sharma): `priya.sharma@email.com` / `author2026`
  - Author 2 (Rohit Kapoor): `rohit.kapoor@email.com` / `author2026`

#### Phase 2: Core REST API & Real-time Layer
- JWT Authentication & RBAC Middleware.
- Author Endpoints:
  - `GET /api/author/books`: Filtered to logged-in author.
  - `POST /api/author/tickets`: Ticket creation with immediate AI classification trigger.
  - `GET /api/author/tickets`: Ticket status and messages.
  - `POST /api/author/tickets/:id/reply`: Add author reply.
- Admin Endpoints:
  - `GET /api/admin/tickets`: Queue with sorting (urgent/aging tickets first) and filtering.
  - `PATCH /api/admin/tickets/:id`: Override category, priority, status, assign admin, private notes.
  - `POST /api/admin/tickets/:id/reply`: Admin reply sent to author.
  - `POST /api/admin/tickets/:id/generate-draft`: Trigger or regenerate AI draft.
- Real-Time Updates: Server-Sent Events (SSE) or WebSocket channel so author/admin see replies instantly without browser refresh.

#### Phase 3: AI Engine Grounded in BookLeaf Knowledge Base
- **Categorization Engine**: Strict JSON-structured extraction mapping tickets into the 6 BookLeaf categories.
- **Priority Scorer**: Assesses severity (`Critical`, `High`, `Medium`, `Low`) evaluating overdue royalties, ISBN mismatch alerts, or print quality complaints.
- **Empathetic Draft Generator**:
  - Ingests concise BookLeaf Knowledge Base facts (80/20 royalty math, 45-day cycle, 5-7 day print reprints, 24-48 hr stock re-syncs, Delhi warehouse).
  - Enforces official BookLeaf tone: empathetic, professional, transparent, providing concrete dates and immediate next steps.
- **Cost & Resilience Optimization**:
  - Concise token budgeting (token usage optimized under 800 tokens per evaluation).
  - Fallback logic: if LLM API is unavailable, the ticket defaults to "General Inquiry / Medium" and enables manual admin drafting with clear UI notifications.

#### Phase 4: Author & Admin Portals (Clean, Modern UI/UX)
- **Author Portal**:
  - Clean overview cards: Published Titles, Total Royalties, Pending Royalties, Active Tickets.
  - Interactive "My Books" table with breakdown of sales, platform availability, and print partners.
  - Ticket Submission modal with book dropdown and attachment UI.
  - Real-time conversation thread with live status badges.
- **Admin Command Center**:
  - High-priority / aging ticket highlight banner.
  - Filtering pills: Category, Priority, Status, Date.
  - One-click AI classification & priority override.
  - Side-by-side AI Draft Response Editor with Knowledge Base citation preview and "Accept & Send" or "Edit Draft".
  - Private Internal Notes tab visible only to staff.

#### Phase 5: Recruiter Telemetry & IP Protection
- Integrate silent evaluator telemetry ping with your email / Telegram alert.
- Include custom Proprietary Evaluation License notice.

#### Phase 6: Production Packaging, Live Deployment & Documentation
- Automated Dockerfile & Render / Vercel deployment setup.
- Interactive API Documentation (OpenAPI/Swagger or Swagger UI embedded).
- SDE-Grade README:
  - Architecture breakdown and Ponytail design decisions.
  - Evaluation credentials and quickstart scripts.
  - Prompt engineering rationale and token cost analysis.
  - 1-page executive write-up for the interview team.
