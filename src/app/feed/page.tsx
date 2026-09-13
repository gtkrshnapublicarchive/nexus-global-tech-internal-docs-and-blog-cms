import { redirect } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { db } from "@/core/database/db";
import { ArticleStatus } from "@prisma/client";
import { Navbar } from "@/shared/ui/navbar";
import { FeedView } from "@/features/feed/feed_view";
import { FeedArticleItem, DepartmentFilterItem } from "@/features/feed/feed_types";

export const metadata = {
  title: "Feed - Nexus Knowledge & Technical Blog",
  description: "Company documentation feed for Nexus Global Tech",
};

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Anti-Pattern 1: Strictly query only PUBLISHED articles for the reader feed
  const [articles, departments, userBookmarks, topAuthors] = await Promise.all([
    db.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
      },
      orderBy: [
        { isPinned: "desc" },
        { publishedAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        documentType: true,
        aurumBounty: true,
        lastVerifiedAt: true,
        verifiedBy: true,
        isPinned: true,
        readTimeMinutes: true,
        wordCount: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
            department: true,
            aurumBalance: true,
          },
        },
        department: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    }),
    db.department.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    db.bookmark.findMany({
      where: { userId },
      select: { articleId: true },
    }),
    db.user.findMany({
      take: 4,
      orderBy: { aurumBalance: "desc" },
      select: {
        id: true,
        name: true,
        department: true,
        aurumBalance: true,
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
            },
          },
        },
      },
    }),
  ]);

  const bookmarkSet = new Set(userBookmarks.map((b) => b.articleId));

  const feedArticles: FeedArticleItem[] = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    coverImageUrl: a.coverImageUrl,
    documentType: a.documentType,
    aurumBounty: a.aurumBounty,
    lastVerifiedAt: a.lastVerifiedAt ? a.lastVerifiedAt.toISOString() : null,
    verifiedBy: a.verifiedBy,
    isPinned: a.isPinned,
    readTimeMinutes: a.readTimeMinutes,
    wordCount: a.wordCount,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    author: a.author,
    department: a.department,
    isBookmarked: bookmarkSet.has(a.id),
  }));

  const deptFilters: DepartmentFilterItem[] = departments.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    count: d._count.articles,
  }));

  const leaderboard = topAuthors.map((author) => ({
    id: author.id,
    name: author.name,
    department: author.department,
    aurumBalance: author.aurumBalance,
    articleCount: author._count.articles,
  }));

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <Navbar user={session.user} />
      <main>
        <FeedView
          articles={feedArticles}
          departments={deptFilters}
          leaderboard={leaderboard}
        />
      </main>
    </div>
  );
}
