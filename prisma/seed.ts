import "dotenv/config";
import { Role, ArticleStatus, DocumentType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db as prisma } from "../src/core/database/db";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Seed Departments
  const departments = [
    {
      name: "Engineering",
      slug: "engineering",
      description: "Architecture guidelines, RFCs, and infrastructure runbooks.",
    },
    {
      name: "Product",
      slug: "product",
      description: "Roadmaps, customer discoveries, and feature specifications.",
    },
    {
      name: "Design",
      slug: "design",
      description: "Design systems, typography tokens, and component guidelines.",
    },
    {
      name: "People/HR",
      slug: "people-hr",
      description: "Engineering onboarding, company culture, and operational SOPs.",
    },
  ];

  const departmentMap = new Map<string, string>();
  for (const dept of departments) {
    const record = await prisma.department.upsert({
      where: { slug: dept.slug },
      update: { name: dept.name, description: dept.description },
      create: dept,
    });
    departmentMap.set(dept.name, record.id);
  }

  // 2. Seed Users
  const marcus = await prisma.user.upsert({
    where: { email: "marcus@nexusglobal.tech" },
    update: {
      name: "Marcus Aurelius",
      role: Role.EDITOR,
      department: "Engineering",
      password: hashedPassword,
      aurumBalance: 450,
    },
    create: {
      name: "Marcus Aurelius",
      email: "marcus@nexusglobal.tech",
      password: hashedPassword,
      role: Role.EDITOR,
      department: "Engineering",
      aurumBalance: 450,
    },
  });

  const nadia = await prisma.user.upsert({
    where: { email: "nadia@nexusglobal.tech" },
    update: {
      name: "Nadia Chen",
      role: Role.READER,
      department: "Engineering",
      password: hashedPassword,
      aurumBalance: 150,
    },
    create: {
      name: "Nadia Chen",
      email: "nadia@nexusglobal.tech",
      password: hashedPassword,
      role: Role.READER,
      department: "Engineering",
      aurumBalance: 150,
    },
  });

  // 3. Seed Articles
  const engineeringId = departmentMap.get("Engineering")!;
  const designId = departmentMap.get("Design")!;
  const peopleId = departmentMap.get("People/HR")!;
  const productId = departmentMap.get("Product")!;

  const article1 = await prisma.article.upsert({
    where: { slug: "rfc-104-event-driven-microservices-standards" },
    update: {
      title: "RFC-104: Event-Driven Microservices Standards Across Aurelia Clusters",
      coverImageUrl: "/images/architecture_cover.jpg",
      isPinned: true,
      pinnedAt: new Date("2026-09-10T08:00:00Z"),
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date("2026-09-10T08:30:00Z"),
    },
    create: {
      title: "RFC-104: Event-Driven Microservices Standards Across Aurelia Clusters",
      slug: "rfc-104-event-driven-microservices-standards",
      excerpt: "Standardizing event schema validation, idempotency keys, and Kafka broker partition strategies.",
      content: `## Executive Summary
This RFC formalizes the messaging conventions for all inter-service communication across Nexus Global Tech clusters.

### Idempotency Requirements
Every consumer must guarantee duplicate event suppression using an atomic Redis check:

\`\`\`typescript
interface DomainEvent<T> {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: T;
  timestamp: string;
}

export async function processEvent(event: DomainEvent<unknown>) {
  const acquired = await redis.set(\`idemp:\${event.id}\`, "1", "NX", "EX", 86400);
  if (!acquired) {
    console.warn("Duplicate event skipped:", event.id);
    return;
  }
  // Execute domain transition
}
\`\`\`

### Schema Registry Compatibility
All event payloads are strictly governed by JSON Schema specifications version 7. Backward compatibility must be preserved across minor revisions.`,
      coverImageUrl: "/images/architecture_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      isPinned: true,
      pinnedAt: new Date("2026-09-10T08:00:00Z"),
      readTimeMinutes: 4,
      wordCount: 380,
      authorId: marcus.id,
      departmentId: engineeringId,
      publishedAt: new Date("2026-09-10T08:30:00Z"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "post-mortem-cache-invalidation-storm" },
    update: {
      title: "Post-Mortem: Incident 2026-08-22 Distributed Cache Invalidation Storm",
      coverImageUrl: "/images/postmortem_cover.jpg",
      isPinned: true,
      pinnedAt: new Date("2026-09-11T10:00:00Z"),
      status: ArticleStatus.PUBLISHED,
    },
    create: {
      title: "Post-Mortem: Incident 2026-08-22 Distributed Cache Invalidation Storm",
      slug: "post-mortem-cache-invalidation-storm",
      excerpt: "Technical root-cause analysis of the 14-minute latency spike caused by cascading Redis cache evictions.",
      content: `## Incident Overview
On August 22, 2026 at 14:15 UTC, client API latency spiked from 32ms to 4,200ms across European region edges.

### Root Cause
A bulk product metadata migration triggered 250,000 synchronous cache invalidations simultaneously.

\`\`\`go
// Vulnerable implementation: synchronous batch purge
func PurgeKeys(keys []string) error {
    for _, k := range keys {
        redisClient.Del(ctx, k)
    }
    return nil
}
\`\`\`

### Permanent Resolution
1. Replaced synchronous key purges with asynchronous Redis \`UNLINK\` worker queues.
2. Introduced jitter (5% to 15%) across all cache TTL expiration timestamps.
3. Added circuit breakers preventing database read spikes during cold restarts.`,
      coverImageUrl: "/images/postmortem_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      isPinned: true,
      pinnedAt: new Date("2026-09-11T10:00:00Z"),
      readTimeMinutes: 5,
      wordCount: 460,
      authorId: marcus.id,
      departmentId: engineeringId,
      publishedAt: new Date("2026-09-11T11:00:00Z"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "nexus-engineering-onboarding-sop" },
    update: {
      coverImageUrl: "/images/onboarding_cover.jpg",
    },
    create: {
      title: "Nexus Engineering Onboarding: Local Stack and Secret Vaults",
      slug: "nexus-engineering-onboarding-sop",
      excerpt: "Complete step-by-step checklist for new software engineers joining the Nexus technical team.",
      content: `## Welcome to Nexus Global Tech
This guide outlines the standard workstation setup, local Docker container orchestrations, and secret provisioning.

### Step 1: Workstation Dependencies
Ensure you have installed:
- Docker Desktop or OrbStack
- Node.js 24 LTS and npm 11
- Git with company GPG signing keys

### Step 2: Secret Management
Cluster access tokens are retrieved using the internal CLI utility:

\`\`\`bash
# Pull local development credentials
nexus-cli vault sync --env development
\`\`\`

### Architecture Review Schedule
Weekly RFC review calls take place every Thursday at 14:00 local time.`,
      coverImageUrl: "/images/onboarding_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      isPinned: false,
      readTimeMinutes: 3,
      wordCount: 290,
      authorId: marcus.id,
      departmentId: peopleId,
      publishedAt: new Date("2026-09-08T09:00:00Z"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "design-system-warm-editorial-tokens" },
    update: {
      coverImageUrl: "/images/nexus_hero_banner.jpg",
    },
    create: {
      title: "Design System 2026: Warm Editorial Tokens & Typography Rules",
      slug: "design-system-warm-editorial-tokens",
      excerpt: "Implementing the Warm Editorial Light baseline across internal portals and dashboards.",
      content: `## Foundation
Our internal interfaces adhere strictly to the Warm Editorial Light design specification:

### Color Hierarchy
- Root Canvas: \`#fbfbfa\` warm bone tone.
- Surface Cards: Pure white \`#ffffff\` with 1px \`border-black/8\`.
- Obsidian CTAs: Solid \`#252724\` buttons with zero blur shadows.
- Organic Sage Accents: Soft mint \`#eef2ec\` and verified badges \`#5a8357\`.

### Typography Pairing
Headings utilize **Fraunces** serif, paired with **Geist** or **DM Sans** for all body copy and controls.`,
      coverImageUrl: "/images/nexus_hero_banner.jpg",
      status: ArticleStatus.PUBLISHED,
      isPinned: false,
      readTimeMinutes: 3,
      wordCount: 240,
      authorId: marcus.id,
      departmentId: designId,
      publishedAt: new Date("2026-09-05T14:00:00Z"),
    },
  });

  const articleDbMigration = await prisma.article.upsert({
    where: { slug: "zero-downtime-database-migrations-runbook" },
    update: {
      coverImageUrl: "/images/database_migration_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date("2026-09-02T10:00:00Z"),
    },
    create: {
      title: "Zero-Downtime Database Migrations: PostgreSQL 16 Table Locks and Column Backfills",
      slug: "zero-downtime-database-migrations-runbook",
      excerpt: "Standard operating procedures for non-blocking column additions, concurrent index creation, and batch backfilling on high-throughput tables.",
      content: `## Migration Protocol Overview
When operating high-throughput databases at Nexus Global Tech, standard schema alterations can acquire Exclusive Table Locks and stall API traffic.

### Rule 1: Non-Blocking Index Creation
Never run \`CREATE INDEX\` directly on production tables. Always utilize PostgreSQL concurrent indexing:

\`\`\`sql
-- Forbidden: Exclusive table lock acquired
CREATE INDEX idx_articles_published_at ON articles (published_at);

-- Recommended: Concurrent execution with non-blocking reads and writes
CREATE INDEX CONCURRENTLY idx_articles_published_at ON articles (published_at);
\`\`\`

### Rule 2: Safe Column Additions with Defaults
In PostgreSQL 11+, adding a column with a constant default value does not rewrite the table:

\`\`\`sql
-- Safe: Metadata update only, completes in sub-millisecond
ALTER TABLE articles ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;
\`\`\`

### Rule 3: Validated Foreign Key Constraints
Split foreign key validation into two non-blocking phases:
1. Add constraint with \`NOT VALID\` (instant lock acquisition).
2. Validate constraint concurrently without table locks.

\`\`\`sql
ALTER TABLE articles 
  ADD CONSTRAINT fk_articles_author 
  FOREIGN KEY (author_id) REFERENCES users (id) 
  NOT VALID;

ALTER TABLE articles VALIDATE CONSTRAINT fk_articles_author;
\`\`\`

### Post-Migration Verification Checklist
- Verify index health via \`pg_stat_user_indexes\`.
- Ensure connection pool saturation remains under 35%.
- Monitor replication lag on standby replicas.`,
      coverImageUrl: "/images/database_migration_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      isPinned: false,
      readTimeMinutes: 5,
      wordCount: 420,
      authorId: marcus.id,
      departmentId: engineeringId,
      publishedAt: new Date("2026-09-02T10:00:00Z"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "rfc-107-envoy-ingress-rate-limiting" },
    update: {
      coverImageUrl: "/images/api_gateway_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date("2026-08-28T14:30:00Z"),
    },
    create: {
      title: "RFC-107: Distributed Rate Limiting & Edge Ingress Routing via Envoy Mesh",
      slug: "rfc-107-envoy-ingress-rate-limiting",
      excerpt: "Implementing sliding-window token bucket limiters and circuit breakers across edge ingress clusters.",
      content: `## RFC Objective
This proposal defines the unified ingress routing and rate-limiting tier across all internal services.

### Token Bucket Specification
Every upstream service must register its quota descriptor within the central Envoy configuration:

\`\`\`yaml
rate_limit_service:
  grpc_service:
    envoy_grpc:
      cluster_name: rate_limit_cluster
  descriptors:
    - key: client_tier
      value: internal_service
      rate_limit:
        unit: MINUTE
        requests_per_unit: 10000
    - key: client_tier
      value: staff_browser
      rate_limit:
        unit: MINUTE
        requests_per_unit: 600
\`\`\`

### Circuit Breaking Thresholds
Edge proxies will immediately trip circuit breakers when consecutive 5xx responses exceed 10% over a 30-second rolling window.

### Fallback Responses
When rate limits trigger, Envoy returns HTTP 429 with standard headers:
- \`Retry-After: <seconds>\`
- \`X-RateLimit-Limit: <quota>\`
- \`X-RateLimit-Remaining: 0\``,
      coverImageUrl: "/images/api_gateway_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      isPinned: false,
      readTimeMinutes: 4,
      wordCount: 350,
      authorId: marcus.id,
      departmentId: engineeringId,
      publishedAt: new Date("2026-08-28T14:30:00Z"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "q4-engineering-security-audit-report" },
    update: {
      coverImageUrl: "/images/security_audit_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date("2026-08-20T11:00:00Z"),
    },
    create: {
      title: "Security Architecture: Automated Secret Vault Rotation and Zero Trust Verification",
      slug: "q4-engineering-security-audit-report",
      excerpt: "Comprehensive audit findings and guidelines for mTLS certificate validation, HashiCorp Vault leasing, and anti-IDOR protections.",
      content: `## Security Posture Summary
Following our Q3 infrastructure audit, Nexus Global Tech has migrated all credential management to short-lived dynamic leases.

### Principle 1: Ephemeral Secret Leasing
Static database credentials stored in environment files are deprecated. All services authenticate through HashiCorp Vault with 12-hour max lease durations:

\`\`\`bash
# Service bootstrap secret retrieval
export VAULT_TOKEN=$(vault auth -method=kubernetes role=nexus-cms)
export DB_CREDS=$(vault read -format=json database/creds/nexus-cms-role)
\`\`\`

### Principle 2: Mutual TLS (mTLS) Inter-Cluster Communication
Every TCP socket connection across Kubernetes pods enforces TLS 1.3 with client certificate validation.

### Principle 3: Anti-IDOR Mutation Checks
Every server mutation endpoint must strictly verify ownership against active session claims:

\`\`\`typescript
export async function mutateResource(resourceId: string, session: Session) {
  const resource = await db.resource.findUnique({ where: { id: resourceId } });
  if (!resource || (resource.ownerId !== session.userId && session.role !== "ADMIN")) {
    throw new ForbiddenError("Resource access denied.");
  }
}
\`\`\``,
      coverImageUrl: "/images/security_audit_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      isPinned: false,
      readTimeMinutes: 4,
      wordCount: 310,
      authorId: marcus.id,
      departmentId: engineeringId,
      publishedAt: new Date("2026-08-20T11:00:00Z"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "q4-product-discovery-matrix-and-prioritization" },
    update: {
      coverImageUrl: "/images/product_roadmap_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date("2026-08-15T09:00:00Z"),
    },
    create: {
      title: "Product Discovery: Internal Developer Tooling Roadmap & Prioritization Matrix",
      slug: "q4-product-discovery-matrix-and-prioritization",
      excerpt: "Analysis of internal developer friction points, sprint release velocity, and feature priority scoring across 200 consultants.",
      content: `## Product Discovery Scope
Our product team surveyed 200 software engineers across Aurelia City to identify highest friction workflows in internal delivery.

### Value vs. Effort Prioritization Matrix
Features are prioritized using the RICE framework (Reach, Impact, Confidence, Effort):

| Initiative | Reach (Staff) | Impact | Confidence | Effort (Weeks) | Priority Score |
|---|---|---|---|---|---|
| Centralized Docs CMS | 200 | Very High | 95% | 3 | 190.0 |
| Automated Secret Rotation | 140 | High | 90% | 2 | 126.0 |
| Distributed Tracing Hub | 110 | High | 85% | 4 | 70.1 |
| Ephemeral Preview Envs | 80 | Medium | 75% | 6 | 25.0 |

### Sprint Release Velocity Targets
- 85% active monthly reader engagement on documentation.
- Median search time under 5 seconds from query to article rendering.
- Zero manual database migration approvals for compliant schema changes.`,
      coverImageUrl: "/images/product_roadmap_cover.jpg",
      status: ArticleStatus.PUBLISHED,
      isPinned: false,
      readTimeMinutes: 4,
      wordCount: 290,
      authorId: marcus.id,
      departmentId: productId,
      publishedAt: new Date("2026-08-15T09:00:00Z"),
    },
  });

  await prisma.article.upsert({
    where: { slug: "rfc-108-opentelemetry-collector-pipeline" },
    update: {
      coverImageUrl: "/images/postmortem_cover.jpg",
      status: ArticleStatus.IN_REVIEW,
    },
    create: {
      title: "RFC-108: Migrating Internal Logging Pipelines to OpenTelemetry Protocol",
      slug: "rfc-108-opentelemetry-collector-pipeline",
      excerpt: "Proposal to standardize distributed traces, metrics, and application logs using the OTLP/gRPC exporter standard.",
      content: `## Proposal Overview
Nexus Global Tech services currently emit logs to Elasticsearch and metrics to Prometheus through heterogeneous SDKs. This RFC introduces unified OpenTelemetry collectors.

### Implementation Architecture
Every pod runs an OpenTelemetry Collector agent as a sidecar:
- Ingests traces, metrics, and structured JSON logs via localhost port 4317.
- Batches and compresses payloads before egress.
- Strips sensitive user PII from request headers.`,
      coverImageUrl: "/images/postmortem_cover.jpg",
      status: ArticleStatus.IN_REVIEW,
      isPinned: false,
      readTimeMinutes: 4,
      wordCount: 300,
      authorId: marcus.id,
      departmentId: engineeringId,
    },
  });

  await prisma.article.upsert({
    where: { slug: "draft-vector-embeddings-code-search" },
    update: {
      coverImageUrl: "/images/architecture_cover.jpg",
      status: ArticleStatus.DRAFT,
    },
    create: {
      title: "Draft: Benchmarking Vector Storage Strategies for Internal Code Search",
      slug: "draft-vector-embeddings-code-search",
      excerpt: "Early experiments comparing pgvector HNSW indexes against dedicated vector databases for repository semantic search.",
      content: `## Preliminary Research Notes
This working draft evaluates embedding indexing strategies for the Nexus documentation portal.

### Early Benchmarks
- pgvector with HNSW index: 12ms p95 latency on 100k chunks.
- Memory consumption: ~420MB RAM overhead.`,
      coverImageUrl: "/images/architecture_cover.jpg",
      status: ArticleStatus.DRAFT,
      isPinned: false,
      readTimeMinutes: 3,
      wordCount: 200,
      authorId: marcus.id,
      departmentId: engineeringId,
    },
  });

  // 4. Seed Nadia's Bookmarks
  await prisma.bookmark.upsert({
    where: {
      userId_articleId: {
        userId: nadia.id,
        articleId: article1.id,
      },
    },
    update: {},
    create: {
      userId: nadia.id,
      articleId: article1.id,
    },
  });

  await prisma.bookmark.upsert({
    where: {
      userId_articleId: {
        userId: nadia.id,
        articleId: articleDbMigration.id,
      },
    },
    update: {},
    create: {
      userId: nadia.id,
      articleId: articleDbMigration.id,
    },
  });

  // 5. Update Document Types, Freshness & Bounties
  await prisma.article.update({
    where: { slug: "rfc-104-event-driven-microservices-standards" },
    data: {
      documentType: DocumentType.RFC,
      verifiedBy: "Systems Architecture Committee",
      aurumBounty: 150,
      lastVerifiedAt: new Date("2026-09-10T08:00:00Z"),
    },
  });

  await prisma.article.update({
    where: { slug: "post-mortem-cache-invalidation-storm" },
    data: {
      documentType: DocumentType.POST_MORTEM,
      verifiedBy: "Reliability & SRE Taskforce",
      aurumBounty: 200,
      lastVerifiedAt: new Date("2026-09-11T10:00:00Z"),
    },
  });

  await prisma.article.update({
    where: { slug: "nexus-engineering-onboarding-sop" },
    data: {
      documentType: DocumentType.ONBOARDING,
      verifiedBy: "Engineering Enablement Guild",
      aurumBounty: 100,
      lastVerifiedAt: new Date("2026-09-01T09:00:00Z"),
    },
  });

  await prisma.article.update({
    where: { slug: "design-system-warm-editorial-tokens" },
    data: {
      documentType: DocumentType.STANDARD,
      verifiedBy: "Design Systems Guild",
      aurumBounty: 100,
      lastVerifiedAt: new Date("2026-09-02T16:00:00Z"),
    },
  });

  await prisma.article.update({
    where: { slug: "zero-downtime-database-migrations-runbook" },
    data: {
      documentType: DocumentType.RUNBOOK,
      verifiedBy: "Data Platform Guild",
      aurumBounty: 120,
      lastVerifiedAt: new Date("2026-09-05T14:00:00Z"),
    },
  });

  await prisma.article.update({
    where: { slug: "rfc-107-envoy-ingress-rate-limiting" },
    data: {
      documentType: DocumentType.RFC,
      verifiedBy: "Core Services Guild",
      aurumBounty: 150,
      lastVerifiedAt: new Date("2026-09-08T11:00:00Z"),
    },
  });

  // Stale notice demonstration (>180 days old verification date)
  await prisma.article.update({
    where: { slug: "q4-engineering-security-audit-report" },
    data: {
      documentType: DocumentType.RUNBOOK,
      verifiedBy: "Information Security",
      aurumBounty: 150,
      lastVerifiedAt: new Date("2026-01-15T09:00:00Z"),
    },
  });

  await prisma.article.update({
    where: { slug: "q4-product-discovery-matrix-and-prioritization" },
    data: {
      documentType: DocumentType.STANDARD,
      verifiedBy: "Product Operations",
      aurumBounty: 100,
      lastVerifiedAt: new Date("2026-09-09T10:00:00Z"),
    },
  });

  await prisma.article.update({
    where: { slug: "rfc-108-opentelemetry-collector-pipeline" },
    data: {
      documentType: DocumentType.RFC,
      verifiedBy: "Observability Guild",
      aurumBounty: 150,
      lastVerifiedAt: new Date("2026-09-11T12:00:00Z"),
    },
  });

  await prisma.article.update({
    where: { slug: "draft-vector-embeddings-code-search" },
    data: {
      documentType: DocumentType.RFC,
      aurumBounty: 150,
    },
  });

  // 6. Seed Document Revision Logs
  await prisma.articleRevision.deleteMany({});
  await prisma.articleRevision.createMany({
    data: [
      {
        articleId: article1.id,
        version: "v1.0",
        summary: "Initial RFC proposal submitted for cluster architecture review",
        authorName: "Marcus Aurelius",
        createdAt: new Date("2026-09-08T10:00:00Z"),
      },
      {
        articleId: article1.id,
        version: "v1.1",
        summary: "Updated Redis idempotency key TTL from 12 hours to 24 hours and partitioned Kafka topics",
        authorName: "Marcus Aurelius",
        createdAt: new Date("2026-09-10T08:30:00Z"),
      },
      {
        articleId: article1.id,
        version: "v1.2",
        summary: "Finalized Kafka cluster consumer partition configuration and dead-letter queues",
        authorName: "Marcus Aurelius",
        createdAt: new Date("2026-09-11T12:00:00Z"),
      },
      {
        articleId: articleDbMigration.id,
        version: "v1.0",
        summary: "Initial operational runbook for dual-write PostgreSQL index creation",
        authorName: "Marcus Aurelius",
        createdAt: new Date("2026-09-03T11:00:00Z"),
      },
      {
        articleId: articleDbMigration.id,
        version: "v1.1",
        summary: "Added lock_timeout and statement_timeout safeguards for busy production tables",
        authorName: "Marcus Aurelius",
        createdAt: new Date("2026-09-05T14:00:00Z"),
      },
    ],
  });

  console.log("[OK] Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("[x] Database seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
