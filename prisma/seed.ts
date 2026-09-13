import "dotenv/config";
import { Role, ArticleStatus } from "@prisma/client";
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
    },
    create: {
      name: "Marcus Aurelius",
      email: "marcus@nexusglobal.tech",
      password: hashedPassword,
      role: Role.EDITOR,
      department: "Engineering",
    },
  });

  const nadia = await prisma.user.upsert({
    where: { email: "nadia@nexusglobal.tech" },
    update: {
      name: "Nadia Chen",
      role: Role.READER,
      department: "Engineering",
      password: hashedPassword,
    },
    create: {
      name: "Nadia Chen",
      email: "nadia@nexusglobal.tech",
      password: hashedPassword,
      role: Role.READER,
      department: "Engineering",
    },
  });

  // 3. Seed Articles
  const engineeringId = departmentMap.get("Engineering")!;
  const designId = departmentMap.get("Design")!;
  const peopleId = departmentMap.get("People/HR")!;

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

  // 4. Seed Nadia's Bookmark
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
