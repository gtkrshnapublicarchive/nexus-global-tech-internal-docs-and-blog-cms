# Nexus Global Tech - Internal Docs & Engineering Blog CMS

> Dedicated internal technical publishing and engineering documentation portal designed exclusively for Nexus Global Tech staff.

---

## 1. Executive Summary

Nexus Knowledge & Engineering Blog CMS is a high-performance, single-tenant internal publishing platform engineered to centralize architectural decision records (ADRs), request for comments (RFCs), incident post-mortems, onboarding guides, and runbooks across Nexus Global Tech.

### 1.1 Enterprise Context (Fictional Case Study)
* **Organization**: Nexus Global Tech
* **Location**: 88 Silicon Arcade, Aurelia City
* **Workforce**: 200 software engineers, product managers, and designers across Engineering, Product, Design, and People/HR
* **Publishing Cadence**: 4 to 8 internal technical publications weekly
* **Incentive Engine**: Aurum (AUR), internal recognition bounty system rewarding authors for high-value technical write-ups

### 1.2 Dedicated Architecture: Non-SaaS Principle
This platform is deliberately designed as a dedicated, private enterprise portal rather than a multi-tenant SaaS application:
* No public signup, tenant segregation, or external monetization.
* Strictly wired to internal departmental taxonomies and authentication.
* Privileged editorial surfaces are decoupled and hidden from general reader views.
* Single-enter orchestration scripts and Docker containerization guarantee instant reproducible setups.

---

## 2. Core Capabilities & Feature Matrix

### 2.1 Markdown Authoring Studio
* **Split-Screen Studio**: Side-by-side editing with raw GitHub-flavored Markdown on the left and real-time rendered preview on the right.
* **Document Archetypes**: Dedicated archetypes with visual indicators:
  * `RFC` (Request for Comments)
  * `ADR` (Architecture Decision Record)
  * `POST_MORTEM` (Incident Analysis)
  * `RUNBOOK` (Operational Guide)
  * `ONBOARDING` (Team Induction)
  * `STANDARD` (Engineering Standard)
* **Dynamic Reading Estimation**: Live calculation of word count and estimated reading time based on a 200 words-per-minute baseline.
* **Aurum Bounty Engine**: Automated reward calculation attributing AUR tokens to authors based on document complexity, archetype weight, and depth.

### 2.2 Editorial Lifecycle Management
* **Publishing States**: Full transition lifecycle through `DRAFT`, `IN_REVIEW`, `PUBLISHED`, and `ARCHIVED`.
* **Editorial Review Queue**: Tabbed administrative management workspace with instant status transitions.
* **Top Banner Announcements**: Pinned article system capped at a maximum of 2 concurrent announcements to avoid feed clutter.
* **Granular Revision Changelog**: Versioned snapshots tracking article iterations, modification summaries, and contributor attribution.

### 2.3 Reader Experience & Knowledge Discovery
* **Warm Editorial Light Aesthetic**: Built upon an editorial palette (`#fbfbfa` canvas, Fraunces serif headlines, DM Sans body, hairline borders, obsidian buttons, and sage green accents).
* **Instant Feed & Archetype Filtering**: Real-time client-side search across titles and excerpts, coupled with department and archetype tabs.
* **Document Freshness Sentinel**: Automatic staleness detection displaying last-verified dates, verification badges, and review indicators.
* **Dynamic Table of Contents**: Automatically parsed `h2` and `h3` hierarchy with active viewport highlighting and smooth anchor navigation.
* **Reading Progress Bar**: Responsive top-pinned scroll progression indicator.
* **Code Block Enhancer**: One-click clipboard copy utility embedded into syntax-highlighted code blocks.
* **Canonical Internal Sharing**: Quick-copy button for internal corporate documentation links.
* **Personal Bookmarks**: Persistent bookmarking system bound to employee profiles.

---

## 3. Technology Stack

| Layer | Technology | Architectural Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server-side rendering (SSR) for markdown parsing, Server Actions for mutations, and zero-bundle server components. |
| Language | TypeScript 5 (Strict) | Co-located DTO contracts and compile-time type safety across database queries, actions, and UI components. |
| Database | PostgreSQL 16 (Alpine) | ACID-compliant relational data store for articles, revisions, departments, users, and bookmarks. |
| ORM | Prisma ORM 7 | Relational query builder with automated schema migrations and type generation. |
| Authentication | NextAuth.js (Auth.js) | Session token persistence with custom JWT role claims (`READER` vs `EDITOR`). |
| Validation | Zod | Runtime validation for article payloads, editorial status updates, and bookmarking actions. |
| Styling | Tailwind CSS 4 | Custom design tokens implementing the Warm Editorial Light design language. |
| Containerization | Docker & Docker Compose | Self-contained local and production deployment stack. |

---

## 4. Role-Based Access Control (RBAC)

The portal strictly enforces two enterprise roles:

| Capability | Staff Reader (`READER`) | Content Author / Editor (`EDITOR`) |
|---|:---:|:---:|
| Read Published Articles | Allowed | Allowed |
| Instant Search & Filtering | Allowed | Allowed |
| Personal Bookmarks | Allowed | Allowed |
| Access Markdown Studio (`/editor`) | Denied (DOM excluded + Route Guard) | Allowed |
| Save Drafts & Submit for Review | Denied | Allowed |
| Publish / Archive Articles | Denied | Allowed |
| Pin Announcements to Feed | Denied | Allowed |
| Review Queue Operations | Denied | Allowed |

### Security Guarantees
* **Anti-IDOR Protection**: Database mutation queries enforce strict author ownership or editor-level clearance.
* **Zero Privilege Signposting**: Reader navigation and views omit all references to administrative endpoints.
* **Route Interception**: Unauthorized attempts to access `/editor` redirect safely to `/feed` without leaking system topology.

---

## 5. Seed Accounts & Verification Credentials

The database seed populates pre-configured departmental personas for immediate evaluation:

| Name | Role | Email | Password | Initial AUR | Department |
|---|---|---|---|:---:|---|
| Marcus Aurelius | `EDITOR` | `marcus@nexusglobal.tech` | `password123` | 450 AUR | Engineering |
| Nadia Chen | `READER` | `nadia@nexusglobal.tech` | `password123` | 150 AUR | Engineering |

---

## 6. Project Architecture

The codebase follows the Semantic Atomic Architecture standard with a ~150-line soft limit per file:

```text
├── deploy.sh                  # Single-enter complete deployment pipeline
├── redeploy.sh                # Container rebuild and restart script
├── test.sh                    # 6-step automated verification suite
├── docker-compose.yml         # Container definitions (Next.js web + PostgreSQL)
├── Dockerfile                 # Multi-stage production container build
├── prisma/
│   ├── schema.prisma          # Relational database models and indexes
│   └── seed.ts                # Department, persona, and article seed script
├── scripts/
│   ├── test_e2e_workflow.ts   # PRD domain assertions and anti-pattern tests
│   └── test_error_formatting.ts # Structured error parsing tests
└── src/
    ├── app/                   # Next.js App Router endpoints and layouts
    ├── core/
    │   ├── auth/              # NextAuth configuration and credentials logic
    │   └── database/          # Prisma database client singleton
    ├── features/
    │   ├── articles/          # Detail view, TOC aside, changelog, and Server Actions
    │   ├── auth/              # Corporate login form and credential handling
    │   ├── bookmarks/         # Bookmark toggles and personal collection actions
    │   ├── editor/            # Markdown studio, metadata forms, review tabs, and editor hook
    │   └── feed/              # Article cards, hero banner, filter bar, and bounty widgets
    ├── middleware.ts          # Route protection and authentication guard
    └── shared/
        ├── lib/               # Error formatters, markdown compiler, read time, and TOC tools
        └── ui/                # Navigation, custom select dropdowns, badges, and progress bar
```

---

## 7. Quickstart & Deployment

### 7.1 Single-Enter Deployment
Execute the deployment bundle to automatically set up environment variables, build containers, verify database readiness, and sync schema migrations:

```bash
chmod +x deploy.sh redeploy.sh test.sh
./deploy.sh
```

The application will be accessible at:
* Portal: `http://localhost:3000`
* Default Route: `/login` (redirects authenticated users to `/feed`)

### 7.2 Manual Local Development Setup
If running outside of Docker containers:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Synchronize database schema and seed data
npx prisma db push
npx tsx prisma/seed.ts

# 4. Start Next.js development server
npm run dev
```

---

## 8. Verification & Quality Assurance

Run the automated test suite to validate all 6 verification stages:

```bash
./test.sh
```

The test runner validates:
1. **ESLint**: Zero warnings or linting defects.
2. **Prisma Validation**: Schema structural integrity.
3. **TypeScript Compiler**: Full type-checking (`tsc --noEmit`).
4. **Next.js Production Build**: Turbopack static optimization and route compilation.
5. **PRD Domain Assertions**:
   * Verification of seeded personas and departments.
   * Anti-Pattern 1: Drafts strictly excluded from general reader feeds.
   * Anti-Pattern 4: Maximum 2 concurrently pinned announcements enforced.
   * Word count and reading time estimator accuracy (200 WPM baseline).
   * Table of Contents anchor generation.
   * Markdown server compilation.
   * Reader bookmark creation and retrieval.
6. **Error Parsing**: Robustness of structured backend error propagation without swallowing.

---

## 9. Environment Variables

| Variable | Description | Default / Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection connection string | `postgresql://nexus_user:nexus_password@localhost:5432/nexus_cms?schema=public` |
| `NEXTAUTH_URL` | Canonical origin URL for authentication callbacks | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Cryptographic secret for signing session tokens | `nexus_super_secret_session_key_production_grade_2026` |

---

## 10. Operational Guidelines

* **Container Redeployment**: Run `./redeploy.sh` for zero-downtime container rebuilds.
* **Database Reset**: Run `npx prisma db push --force-reset && npx tsx prisma/seed.ts` when resetting local test data.
* **Authoring Workflow**: Editors log in via `marcus@nexusglobal.tech`, open `/editor`, author technical documentation using markdown, select an archetype, and submit for publication.
