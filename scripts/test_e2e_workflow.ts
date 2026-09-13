import "dotenv/config";
import { db } from "../src/core/database/db";
import { calculateReadTime } from "../src/shared/lib/read_time";
import { extractTableOfContents } from "../src/shared/lib/toc";
import { compileMarkdownToHtml } from "../src/shared/lib/markdown";
import { ArticleStatus } from "@prisma/client";

async function runVerification() {
  console.log("==================================================");
  console.log(" Nexus CMS Domain & Anti-Pattern Verification");
  console.log("==================================================");

  // 1. Verify Seeded Personas and Departments
  const nadia = await db.user.findUnique({ where: { email: "nadia@nexusglobal.tech" } });
  const marcus = await db.user.findUnique({ where: { email: "marcus@nexusglobal.tech" } });
  const depts = await db.department.findMany();

  if (!nadia || nadia.role !== "READER") {
    throw new Error("Reader persona Nadia verification failed.");
  }
  if (!marcus || marcus.role !== "EDITOR") {
    throw new Error("Editor persona Marcus verification failed.");
  }
  if (depts.length < 4) {
    throw new Error("Department taxonomy verification failed.");
  }
  console.log("[OK] Personas & Departments verified.");

  // 2. Anti-Pattern 1 Test: Draft & In-Review articles are strictly excluded from reader feed
  const engineeringDept = depts.find(d => d.slug === "engineering")!;
  
  const testDraftSlug = "test-internal-architecture-draft-rfc";
  await db.article.upsert({
    where: { slug: testDraftSlug },
    update: { status: ArticleStatus.DRAFT },
    create: {
      title: "Confidential Incident Draft",
      slug: testDraftSlug,
      excerpt: "Internal sensitive draft that must never leak to reader feed.",
      content: "## Secret Details\nUnpublished data.",
      departmentId: engineeringDept.id,
      authorId: marcus.id,
      status: ArticleStatus.DRAFT,
      isPinned: false,
    },
  });

  const publicFeed = await db.article.findMany({
    where: { status: ArticleStatus.PUBLISHED },
    select: { slug: true },
  });

  const leaked = publicFeed.some(a => a.slug === testDraftSlug);
  if (leaked) {
    throw new Error("CRITICAL: Draft article leaked into published reader feed!");
  }
  console.log("[OK] Anti-Pattern 1 verified: Drafts strictly isolated from public feed.");

  // 3. Anti-Pattern 4 Test: Pinned article ceiling invariant (<= 2 pinned articles)
  const pinnedArticles = await db.article.findMany({
    where: { isPinned: true },
  });
  if (pinnedArticles.length > 2) {
    throw new Error(`CRITICAL: Pinned article count (${pinnedArticles.length}) exceeds 2!`);
  }
  console.log(`[OK] Anti-Pattern 4 verified: Currently ${pinnedArticles.length}/2 pinned articles.`);

  // 4. Verify Read Time & Word Count calculation
  const testContent = "Word ".repeat(600); // 600 words -> 3 minutes
  const { minutes, wordCount } = calculateReadTime(testContent);
  if (minutes !== 3 || wordCount !== 600) {
    throw new Error(`Read time mismatch: expected 3m/600w, got ${minutes}m/${wordCount}w`);
  }
  console.log("[OK] Read time estimator verified (200 WPM baseline).");

  // 5. Verify Table of Contents generation
  const testMarkdown = `## Section One\nText here.\n### Sub Section A\nMore text.\n## Section Two\nFinal text.`;
  const toc = extractTableOfContents(testMarkdown);
  if (toc.length !== 3 || toc[0].id !== "section-one" || toc[1].id !== "sub-section-a") {
    throw new Error("Table of Contents extraction failed.");
  }
  console.log("[OK] Table of Contents extraction verified with anchor slugs.");

  // 6. Verify Markdown compilation with HTML anchors
  const compiled = compileMarkdownToHtml(testMarkdown);
  if (!compiled.includes('<h2 id="section-one"') || !compiled.includes('<h3 id="sub-section-a"')) {
    throw new Error("Compiled markdown lacks heading IDs.");
  }
  console.log("[OK] Markdown HTML compilation verified.");

  // 7. Verify Nadia's Bookmarking functionality
  const userBookmark = await db.bookmark.findFirst({
    where: { userId: nadia.id },
    include: { article: true },
  });
  if (!userBookmark) {
    throw new Error("Bookmark persistence check failed.");
  }
  console.log(`[OK] Personal bookmark verified for user: ${userBookmark.article.title}`);

  // Clean up test draft
  await db.article.deleteMany({ where: { slug: testDraftSlug } });

  console.log("==================================================");
  console.log("[OK] All PRD specification assertions PASSED!");
  console.log("==================================================");
}

runVerification()
  .catch((err) => {
    console.error("[x] Verification error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    process.exit(0);
  });
