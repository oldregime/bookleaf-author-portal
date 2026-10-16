# BookLeaf Publishing — Author Support & Communication Portal
> **Full Stack Technical Assignment Submission**  
> Candidate: **Divyansh Joshi** (<divyanshjoshidev@gmail.com>)  
> Portfolio: [oldregime.github.io](https://oldregime.github.io) | GitHub: [@oldregime](https://github.com/oldregime)

## 🌐 Live Production Demo & Repository
- **Live Netlify Deployment:** [https://bookleaf-author-portal-divyansh.netlify.app](https://bookleaf-author-portal-divyansh.netlify.app)
- **GitHub Repository:** [https://github.com/oldregime/bookleaf-author-portal](https://github.com/oldregime/bookleaf-author-portal)
This repository delivers an **Author Support & Communication Portal** built for BookLeaf Publishing to streamline author inquiries across 1,200+ monthly titles. The platform features an **Author Portal**, an **Admin Operations Command Center**, and an **AI-Assisted Knowledge Base Intelligence Engine** that automatically classifies inquiries, calculates priority ratings, and drafts empathetic responses grounded in BookLeaf's operational policies.

---

## 🔑 Demo Login Credentials (Pre-Seeded)
The system is pre-seeded with the exact `bookleaf_sample_data.json` records (10 authors and 18 books).

| Role | Email | Password | Access / Context |
| :--- | :--- | :--- | :--- |
| **Ops Admin** | `admin@bookleafpub.com` | `Admin@BookLeaf2026` | Unified Ticket Queue, AI Drafts, Overrides, Private Notes |
| **Author (Priya Sharma)** | `priya.sharma@email.com` | `Password@123` | 2 Books, ₹3,570 Pending Royalty, Open Ticket |
| **Author (Rohit Kapoor)** | `rohit.kapoor@email.com` | `Password@123` | 2 Books, ISBN Discrepancy Ticket |
| **Author (Aarav Patel)** | `aarav.patel@email.com` | `Password@123` | Published Titles |

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18+ recommended; verified on Node v22)
- npm

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/oldregime/bookleaf-author-portal.git
cd bookleaf-author-portal

# Install dependencies
npm install
```

### 2. Seed Database
Pre-populates SQLite with the official 10 authors, 18 books, and initial ticket threads:
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
# Or for standard production start:
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Run Automated Tests
```bash
npm test
```

---

## 🏗️ Architecture & "Ponytail" Philosophy

This project strictly follows the **Lazy Senior Developer ("Ponytail") philosophy**:
- **Zero Framework Bloat**: Rather than adding 15 heavy dependencies, we use native platform capabilities:
  - Native **Server-Sent Events (SSE)** for zero-refresh ticket updates instead of large socket servers.
  - Native **Crypto (`randomUUID()`)** instead of external uuid packages.
  - Native **Fetch & SQLite** with WAL mode for microsecond response times and zero external database setup.
- **Role-Based Access Control (RBAC)**: All author endpoints verify authorship ownership (`author_id = req.user.authorId`), while admin endpoints require staff role permissions.
- **Graceful AI Degradation**: The system communicates with LLM APIs when `OPENAI_API_KEY` or `GEMINI_API_KEY` is present. If the API is rate-limited, unreachable, or missing, a deterministic rule-based intelligence engine automatically handles classification and drafts empathetic responses matching BookLeaf policies without dropping inquiries.

---

## 🤖 AI Knowledge Base & Prompt Strategy

### 1. Knowledge Base Grounding
The AI service is provided with the exact BookLeaf policies:
- **80/20 Royalty Split**: 80% net profit to authors (MRP minus print, commission, shipping).
- **Quarterly Payout Window**: Within 45 days of quarter close with ₹1,000 threshold.
- **5–7 Business Day Print Reprints**: Complimentary reprints upon photo verification for defective copies.
- **24–48 Hour Amazon Stock Re-Syncs**: Automated catalog re-sync for unavailable listings.

### 2. Token Cost & Budgeting Optimization
- Instead of dumping raw chat logs and redundant instructions, context is injected via a structured knowledge dictionary under **600 tokens**, achieving sub-second response generation and minimizing API expenditure.

---

## 📡 REST API Reference

| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates author or admin, returns JWT |
| `GET` | `/api/author/books` | Author | Fetches catalog, royalties, and statuses for author |
| `GET` | `/api/author/tickets` | Author | Lists all tickets raised by logged-in author |
| `POST` | `/api/author/tickets` | Author | Submits ticket; triggers AI auto-classification |
| `POST` | `/api/author/tickets/:id/reply` | Author | Adds message to ticket thread |
| `GET` | `/api/admin/tickets` | Admin | Filterable queue sorted by urgency and SLA aging |
| `GET` | `/api/admin/tickets/:id` | Admin | Fetches ticket details, thread, and AI draft |
| `PATCH` | `/api/admin/tickets/:id` | Admin | Overrides category, priority, status, or saves note |
| `POST` | `/api/admin/tickets/:id/reply` | Admin | Dispatches response to author; optional resolution |
| `POST` | `/api/admin/tickets/:id/regenerate-draft`| Admin | Regenerates AI draft response on demand |
| `GET` | `/api/events?token=...` | Any | Real-time SSE stream for zero-refresh updates |
| `GET` | `/api/health` | Public | System status, seeded records count, uptime |

---

## 📄 License
This codebase is governed by the [Proprietary Candidate Evaluation License](file:///mnt/personal%20file/from%20w11/bookleaf_assignment/LICENSE.md). Strictly for recruitment evaluation by BookLeaf Publishing.
