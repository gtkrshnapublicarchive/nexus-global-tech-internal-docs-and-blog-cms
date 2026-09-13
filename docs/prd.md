> **FICTIONAL CONTENT DISCLAIMER**
> Everything in this document is entirely fictional and used solely as a case study / template example. This includes, but is not limited to: the brand name ("Nexus Global Tech"), the location/address ("88 Silicon Arcade, Aurelia City"), all names of people (engineers, technical editors, personas), and the currency ("Aurum" / AUR). None of these refer to any real business, real place, real person, or real currency. Any resemblance to actual entities is purely coincidental.

---

### Category: Company Blog and Docs CMS

# Product Requirements Document (PRD)
## Internal Docs & Engineering Blog CMS: Nexus Global Tech

**Category:** Company Blog and Docs CMS
**Document Version:** 1.0
**Status:** Draft
**Date:** September 12, 2026
**Product Type:** Dedicated internal portal for a single enterprise company (not a SaaS/multi-tenant product)

---

## 1. Overview

### 1.1 Enterprise Identity (Fictional Case Study)
This document is authored for the internal technical documentation and knowledge sharing needs of **Nexus Global Tech**, a fictional software engineering consultancy:

| Attribute | Detail |
|---|---|
| Company Name | Nexus Global Tech |
| Location | 88 Silicon Arcade, Aurelia City (fictional) |
| Active Workforce | 200 software engineers, product managers, and designers |
| Core Departments | Engineering, Product, Design, People/HR |
| Publishing Cadence | 4 to 8 internal technical articles and RFC posts weekly |
| Currency | Aurum (AUR), used for internal author recognition bounties |

### 1.2 Product Name
Nexus Knowledge & Technical Blog CMS: an internal technical writing and documentation platform built specifically for Nexus Global Tech staff.

### 1.3 Important Note: Not a SaaS Product
This application is **not a multi-tenant SaaS blogging platform** built for multiple enterprise clients. It is developed **exclusively for Nexus Global Tech**:
- There are no workspace subdomains, client tenant segregations, or white-label theming options.
- Department taxonomy, user groups, and markdown styling are directly wired to Nexus Global Tech internal hierarchies.
- No public user signup or commercial subscription tiers exist.
- Access is restricted exclusively to authenticated company team members.

### 1.4 Background
Nexus Global Tech currently stores engineering practices, post-mortems, and architecture decision records (ADRs) across disconnected markdown files, shared document links, and messaging channels. This fragmentation causes:
- Inability to quickly locate past post-mortems and technical decisions during production incidents.
- No single standardized place for staff to publish technical write-ups and company-wide technical updates.
- No visibility into which engineering guides are outdated or actively read by teams.
- Lack of centralized editorial review before architecture recommendations are posted company-wide.

### 1.5 Goals
- Provide a unified internal technical blog and documentation portal with full-text search.
- Enable department authors to write, preview, and format articles using GitHub-flavored Markdown.
- Implement a two-tier publishing workflow (`Draft` -> `In Review` -> `Published`).
- Allow staff readers to bookmark, search by category tag, and calculate article read times.

### 1.6 Non-Goals
- This application does NOT host a public blog or open-to-the-web documentation portal; it is strictly accessible inside the corporate network.
- This application does NOT replace real-time collaborative document editors (such as Google Docs); it is an editorial publishing CMS.
- This application does NOT include external payment processing for content monetization.

---

## 2. Problem Statement

### 2.1 Problems to Solve
- Important architectural guidelines and post-mortems are buried in chat threads and lost within weeks.
- Junior developers lack a single source of truth for engineering onboarding guides and standard operational procedures.
- Authors have no simple local publishing interface that renders clean code blocks and typography.
- Senior staff cannot pin critical technical updates or RFC notices for company-wide visibility.

### 2.2 Supporting Insights
- The engineering team represents 70% of the company headcount and consumes documentation daily on desktop browsers.
- Articles frequently contain code snippets in TypeScript, Go, and SQL requiring syntax highlighting and structured headings.

---

## 3. Target Users & Personas

### 3.1 User Roles
This application defines **two primary roles**:

| Role | Description |
|---|---|
| Staff Reader | Any company employee who reads documentation, bookmarks articles, and filters topics |
| Content Author / Editor | A designated technical lead or department writer who drafts, reviews, and publishes content |

### 3.2 Personas

**Persona 1 (Staff Reader): Nadia, 25, Junior Frontend Engineer**
- Recently joined Nexus Global Tech and references company architectural guides daily.
- Needs fast search by department tags (`Engineering`, `Frontend`, `API`) and clear estimated read times.
- Reads articles on desktop during coding sessions and bookmarks critical deployment checklists.

**Persona 2 (Content Author / Editor): Marcus, 34, Principal Systems Architect**
- Authors system post-mortems, architecture RFCs, and quarterly engineering review articles.
- Needs a split-screen markdown editor with live preview, syntax highlighting, and code block formatting.
- Needs the ability to save drafts and pin urgent announcements to the homepage banner.

### 3.3 Key Use Cases
- Staff Reader: Search articles by keyword/tag, read formatted markdown posts, bookmark articles, toggle reading view.
- Content Author / Editor: Write articles in markdown editor, upload header banner image paths, submit drafts for review, publish and pin articles.

---

## 4. Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| Monthly Internal Active Readers | Over 85% of total company employees active monthly | Unique employee read session logs |
| Documentation Discoverability | Search query to article click in under 5 seconds | Search latency and interaction event logging |
| Publication Cadence | At least 6 published internal articles per month | Database count of `Published` records |
| Draft-to-Publish Cycle | Under 48 hours for review turnaround | Timestamp delta from `In Review` to `Published` |

---

## 5. Requirements / Specifications

### 5.1 Functional Requirements for Staff Readers

1. **Authentication & Session**
   - Staff members authenticate using their corporate credentials.
   - Persistent session token preserved across browser restarts.

2. **Article Discovery & Feed**
   - Feed displays recent publications with title, author byline, department badge, publication date, and read time.
   - Pinned company announcement banner rendered at the top of the feed when active.
   - Filter by department category (`Engineering`, `Product`, `Design`, `People/HR`).
   - Client-side keyword search bar with real-time filtering across titles and summaries.

3. **Article Detail View**
   - Renders GitHub-flavored Markdown with typography formatting: headers, lists, code syntax blocks, and tables.
   - Table of contents automatically generated from document `h2` and `h3` tags.
   - Personal bookmarking toggle with persistence in user profile.

### 5.2 Functional Requirements for Content Authors / Editors

1. **Markdown Authoring Studio**
   - Dedicated split-pane markdown authoring interface: raw markdown textarea on the left, live HTML preview on the right.
   - Metadata inputs: Article Title, Department Tag, Cover Image URL, Excerpt Summary.
   - Auto-calculated estimated reading time based on word count (200 words per minute baseline).

2. **Editorial Lifecycle Management**
   - Authors can save articles in `Draft` state for ongoing revision.
   - Authors can promote articles to `In Review` for departmental review.
   - Editors can publish articles, making them immediately visible in the company feed.
   - Editors can toggle `IsPinned` status on published articles (maximum 2 pinned articles simultaneously).

3. **Article Management Console**
   - Authors can view a personal list of all owned articles sorted by status (`Draft`, `In Review`, `Published`).
   - Authors can edit or archive their own published articles.

### 5.3 Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Article feed and rendered markdown post must load under 1.2 seconds |
| Scalability | Database must support indexing and full-text search across 5,000 articles |
| Security | Strict authorization prevents readers from modifying or publishing author drafts |
| Typography & Aesthetics | High-contrast editorial typography pairing serif headlines with clean monospace code blocks |
| Compatibility | Optimized for desktop wide screens with responsive readability on corporate laptops |
| Availability | 99.8% uptime during standard working hours (08:00 - 19:00 local time) |

### 5.4 Technology Stack Specification

| Layer / Component | Technology Choice | Version / Tooling | Architectural Rationale |
|---|---|---|---|
| Fullstack Framework | Next.js | Latest stable version when project is created (App Router) | Server-side rendering (SSR) for instantaneous markdown parsing and SEO-like internal indexing. |
| Language & Runtime | TypeScript / Node.js | Latest stable version when project is created (Node.js LTS) | Static contracts shared between Prisma models, markdown DTOs, and editor props. |
| UI & Styling Engine | Tailwind CSS | Latest stable version when project is created | Clean editorial typography plugin support and customizable code-block dark themes. |
| Relational Database | PostgreSQL | Latest stable version when project is created (Alpine image) | Robust relational schema storing article revisions, tags, bookmarks, and author profiles. |
| ORM & Data Layer | Prisma ORM | Latest stable version when project is created | Automated migration generation and relational query helpers for author bylines and bookmarks. |
| Containerization | Docker & Docker Compose | Latest stable version when project is created | Unified local development stack containing Next.js app and persistent PostgreSQL container. |
| Validation & Contracts | Zod | Latest stable version when project is created | Validation on article titles, word count ceilings, department tag enums, and excerpt lengths. |
| Authentication | NextAuth.js / Auth.js | Latest stable version when project is created | Corporate credentials authentication with Reader vs Editor role claims. |

#### Architectural Decisions
- **Unified App Router Monolith:** Eliminates the need for separate headless CMS services (such as Strapi or Contentful), keeping company documentation completely self-contained on internal infrastructure.
- **Server-Side Markdown Compilation:** Markdown is parsed on the server before client hydration, eliminating heavy client-side markdown parsing bundles and ensuring fast page loads.

---

## 6. Access Control & Permission Matrix

### 6.1 Page Access Matrix

| Page / Feature | Guest (Unauthenticated) | Staff Reader | Content Author / Editor |
|---|---|---|---|
| Corporate Login Screen | [Allowed] Visible | [Denied] Redirected to Feed | [Denied] Redirected to Feed |
| Article Discovery Feed | [Denied] Redirects to Login | [Allowed] Full Access | [Allowed] Full Access |
| Article Detail View | [Denied] Redirects to Login | [Allowed] Full Access | [Allowed] Full Access |
| Personal Bookmarks | [Denied] Redirects to Login | [Allowed] Own Bookmarks | [Allowed] Own Bookmarks |
| Markdown Author Studio | [Denied] Redirects to Login | [Denied] Excluded from DOM | [Allowed] Full Access |
| Publish & Pin Action | [Denied] Redirects to Login | [Denied] Excluded from DOM | [Allowed] Full Access |
| Editorial Review Queue | [Denied] Redirects to Login | [Denied] Excluded from DOM | [Allowed] Full Access |

### 6.2 Mandatory Principles
- **DOM Exclusion:** Navigation links to the Markdown Studio and Editorial Review Queue are completely omitted from the Reader DOM.
- **Zero Normal Access-Denied Loops:** Normal reading actions never produce access-denied pages; unauthorized URL manipulation redirects safely to the feed.
- **Two-Layer Validation:** Every article mutation Server Action verifies that the active session has `Editor` permissions or matches author ownership.
- **Anti-IDOR Protection:** Readers cannot update or delete drafts belonging to other employees by manipulating article IDs in requests.
- **Zero Privileged Entry Point Exposure:** Under no circumstances may public documentation views, reader feeds, footers, headers, or metadata advertise, link, or signpost privileged routes (such as editorial desks, admin consoles, or elevated authoring portals). Editorial surfaces must remain unadvertised and accessible only via direct, unlinked URLs.

### 6.3 Acceptance Criteria Related to Access
- Unauthorized visitors or readers attempting direct GET requests to privileged `/editor/*` or `/admin/*` routes are intercepted and returned a generic 404 Not Found or redirected to `/feed` without leaking authoring studio existence.
- Draft articles are strictly filtered out of database queries unless requested by the drafting author or an Editor.

---

## 7. User Flow (Text Description)

### 7.1 Staff Reader Flow: Searching and Reading an Article
1. Employee opens the Nexus Knowledge portal.
2. Employee logs in with corporate credentials.
3. System presents the Article Discovery Feed with pinned announcements at the top.
4. Employee enters a keyword into the search bar or clicks the `Engineering` department tag.
5. System filters article cards instantly by matching title, summary, or department.
6. Employee clicks an article card.
7. System renders the full markdown article, estimated read time, and table of contents.
8. Employee clicks the "Bookmark" icon to save the guide for future reference.

### 7.2 Content Author Flow: Drafting and Publishing an Article
1. Author logs in and clicks "New Article" in the top navigation bar.
2. System opens the split-screen Markdown Author Studio.
3. Author enters title, selects `Engineering`, and types markdown content with code blocks.
4. Author observes the live preview pane updating in real time.
5. Author clicks "Save as Draft" to persist progress in PostgreSQL.
6. When complete, author clicks "Submit for Review", updating state to `In Review`.
7. An Editor reviews the submission and clicks "Publish Article".
8. System updates state to `Published`, assigns a published timestamp, and displays it in the company feed.

### 7.3 Editor Flow: Pinning a Critical Announcement
1. Editor opens the Published Articles console.
2. Editor locates the target architecture announcement.
3. Editor clicks "Pin to Top Banner".
4. System verifies that no more than 2 articles are currently pinned (unpinning the oldest if required).
5. The article immediately renders at the top of the main feed for all staff.

---

## 8. Prohibited Flows / Anti-Patterns

1. **Unapproved Public Exposure:** Draft or in-review articles appearing in the general reader feed is strictly prohibited.
2. **Unauthorized Mutation:** A non-author reader modifying or deleting an author's post is blocked at database query level.
3. **Unbounded Pinning:** More than 2 pinned banner articles simultaneously is prohibited to prevent homepage feed clutter.
4. **Empty Body Submission:** Submitting an article without markdown content or title is prevented by Zod schema validation.
5. **Public Signposting of Editorial/Admin Portals:** Under no circumstances may general reader screens, knowledge-base footers, navigation headers, or metadata display links, buttons, hints, or references to "Editor Login", "CMS Admin", or editorial review queues. Privileged content desks must remain entirely unadvertised to general readers and unauthenticated visitors.

---

## 9. Scope

### 9.1 In-Scope (Version 1 / MVP)
- Markdown authoring studio with live split-screen preview.
- Editorial workflow states: `Draft`, `In Review`, `Published`, `Archived`.
- Department taxonomy filtering and client-side instant search.
- Auto-calculated read time and auto-generated table of contents.
- Reader personal bookmarking list.
- Local Docker container orchestration with PostgreSQL.

### 9.2 Out-of-Scope (Future Versions)
- Real-time collaborative multi-cursor editing.
- PDF and EPUB export formats.
- Public external viewing without company authentication.
- Comment threads and inline paragraph annotations.

---

## 10. Dependencies & Constraints

### 10.1 Dependencies
- Pre-seeded department list (`Engineering`, `Product`, `Design`, `People/HR`).
- Corporate auth session credentials.

### 10.2 Constraints
- Exclusively internal network deployment; no external public indexing.
- Maximum article length capped at 50,000 characters to ensure optimal database storage and render speeds.

---

## 11. Development Phases (Sequential, Not Time-Boxed)

| Order | Phase | Description | Completion Criteria |
|---|---|---|---|
| Phase 1 | Schema & Relational Models | Define Prisma models for Users, Articles, Tags, and Bookmarks with department seed data | Database migrations execute cleanly and seed records populate |
| Phase 2 | Corporate Auth & Role Guarding | Configure NextAuth.js with Reader and Editor claims and build middleware route guards | Readers are restricted to feed and detail routes; editors access studio |
| Phase 3 | Split-Screen Markdown Studio | Build client-side markdown editor with live HTML preview and auto-read-time calculation | Author can format headers, code blocks, and save drafts via Server Actions |
| Phase 4 | Feed Discovery & Search | Construct responsive article feed with pinned banner, department chips, and search bar | Instant client-side search and tag filtering function accurately |
| Phase 5 | Bookmarks & Reading Features | Implement reader bookmarking, table of contents generator, and article archiving | Reader can toggle bookmarks and navigate via table of contents anchors |
| Phase 6 | Containerization & Verification | Package Docker Compose configuration and execute integration test suites | Single enter command deploys pristine application with verified role permissions |

---

## 12. Risks & Open Questions

### 12.1 Risks
- **Stale Documentation:** Old technical posts remaining in search results without revision. *Mitigation:* Clear publication date display and annual archiving flag for editors.
- **Large Markdown Payloads:** Massive unoptimized images pasted into markdown. *Mitigation:* Maximum character cap and validation on markdown asset URLs.

### 12.2 Open Questions
- Should authors be notified when readers bookmark their articles? (Deferred to v2).

---

## 13. Stakeholders

| Role | Responsibility |
|---|---|
| Product Lead | Specifies editorial workflow stages, taxonomy standards, and permission boundaries |
| Fullstack Engineer | Develops Next.js application, markdown compiler pipeline, and Prisma models |
| QA Engineer | Authors role-based permission tests and validates markdown sanitization |
| Principal Architect | Reviews technical documentation structure and authoring requirements |
