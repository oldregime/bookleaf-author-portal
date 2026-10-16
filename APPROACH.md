# BookLeaf Publishing Assignment — Architectural Approach & Engineering Write-Up
**Author:** Divyansh Joshi (<divyanshjoshidev@gmail.com>)  
**Role:** Full Stack Software Engineer Applicant

---

### 1. Executive Summary & Core Intent
BookLeaf Publishing's growth to 1,200+ monthly titles introduces communication bottlenecks across royalty explanations, ISBN discrepancies, and production status. This project was engineered not as a toy prototype, but as an **SDE-grade, production-structured foundation** prioritizing reliability, low latency, empathetic author communication, and operational efficiency for the triage team.

---

### 2. Architectural Decisions & Key Prioritizations

#### A. Lean, Zero-Overhead Foundations ("Ponytail" Principles)
Rather than introducing heavy microservice boilerplate or 20+ npm dependencies for trivial utilities, I selected a unified, high-performance architecture:
- **Server-Sent Events (SSE)**: Built a lightweight broadcast hub (`src/services/realtime.ts`) instead of running heavy WebSocket servers. Authors and admins receive zero-refresh updates with automatic 25s keepalive heartbeats and zero extra dependencies.
- **Embedded WAL-Mode SQLite**: Chose `better-sqlite3` with Write-Ahead Logging (WAL) to provide sub-millisecond query execution, zero cold starts, and immediate portability across local machines and cloud containers.
- **Strict Role-Based Access Control (RBAC)**: Auth middleware ensures authors cannot view other authors' books or internal tickets, and private admin notes remain inaccessible on author views.

#### B. Grounded AI Intelligence with Graceful Fallback
AI in production must not crash business workflows when external APIs degrade:
- **Context Grounding**: The AI prompt is bound to BookLeaf’s Knowledge Base (80/20 royalty math, quarterly cycles, Delhi print facility SLAs, Amazon sync timelines).
- **Graceful Degradation**: If external LLM APIs face network dropouts, rate-limits, or quota exhaustion, an intelligent deterministic classification engine seamlessly steps in. Inquiries are never dropped, and admins always have an editable draft.
- **Cost Awareness**: Token inputs are capped under 600 tokens per evaluation, avoiding multi-turn token waste.

---

### 3. Trade-offs Made

1. **Monolithic Full-Stack vs Separate Services**: A single unified Node.js runtime hosting both the API and frontend was prioritized over detached repos to guarantee 100% friction-free evaluation and instant setup for the hiring team.
2. **Mock File Upload UI vs Cloud Storage**: The brief stated file upload is UI-only. I included attachment metadata handling in the schema and UI while avoiding unnecessary S3/R2 cloud credentials setup for local test runs.

---

### 4. Roadmap to Production Scale (Next 60–90 Days)

If deployed into BookLeaf’s production ecosystem, I would evolve this architecture through:
1. **Queue-Backed AI Processing**: Offload classification and drafts to a background Redis/BullMQ worker so ticket creation returns in `< 30ms`.
2. **Email & WhatsApp Webhook Ingestion**: Ingest incoming author emails directly into tickets via Cloudflare Email Routing or SendGrid Inbound Parse.
3. **Automated Defect Photo Verification**: Use Vision Models (e.g. Gemini 1.5 Flash Vision) to inspect uploaded book photos for print misalignments and auto-approve reprints according to policy.
