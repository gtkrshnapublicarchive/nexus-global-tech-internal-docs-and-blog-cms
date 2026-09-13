import { notFound, redirect } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { db } from "@/core/database/db";
import { ArticleStatus } from "@prisma/client";
import { Navbar } from "@/shared/ui/navbar";
import { ReadingProgressBar } from "@/shared/ui/reading_progress_bar";
import { compileMarkdownToHtml } from "@/shared/lib/markdown";
import { extractTableOfContents } from "@/shared/lib/toc";
import { ArticleHeader } from "@/features/articles/article_header";
import { ArticleContentView } from "@/features/articles/article_content_view";
import { ArticleTocAside } from "@/features/articles/article_toc_aside";

interface ArticleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} - Nexus Knowledge Base`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { slug } = await params;

  const article = await db.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          department: true,
        },
      },
      department: true,
      revisions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  // Anti-Pattern 1: Draft or In-Review articles are strictly restricted to author or Editor
  const isEditor = session.user.role === "EDITOR";
  const isAuthor = article.authorId === session.user.id;
  if (article.status !== ArticleStatus.PUBLISHED && !isEditor && !isAuthor) {
    notFound();
  }

  const bookmark = await db.bookmark.findUnique({
    where: {
      userId_articleId: {
        userId: session.user.id,
        articleId: article.id,
      },
    },
  });

  const compiledHtml = compileMarkdownToHtml(article.content);
  const toc = extractTableOfContents(article.content);
  const canReverify = isEditor || isAuthor;

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <ReadingProgressBar />
      <Navbar user={session.user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <ArticleHeader
          article={article}
          isBookmarked={!!bookmark}
          canReverify={canReverify}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <ArticleContentView
            title={article.title}
            coverImageUrl={article.coverImageUrl}
            compiledHtml={compiledHtml}
            revisions={article.revisions}
          />
          <ArticleTocAside toc={toc} slug={article.slug} />
        </div>
      </main>
    </div>
  );
}
