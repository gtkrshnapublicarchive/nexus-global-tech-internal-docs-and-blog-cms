import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/core/auth/auth";
import { db } from "@/core/database/db";
import { ArticleStatus } from "@prisma/client";
import { Navbar } from "@/shared/ui/navbar";
import { compileMarkdownToHtml } from "@/shared/lib/markdown";
import { extractTableOfContents } from "@/shared/lib/toc";
import { BookmarkButton } from "@/features/feed/bookmark_button";
import { ArrowLeft, Clock, Calendar, User, List } from "lucide-react";

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
    },
  });

  if (!article) {
    notFound();
  }

  // Anti-Pattern 1: Draft or In-Review articles are strictly restricted to author or Editor
  if (article.status !== ArticleStatus.PUBLISHED) {
    const isEditor = session.user.role === "EDITOR";
    const isAuthor = article.authorId === session.user.id;
    if (!isEditor && !isAuthor) {
      notFound();
    }
  }

  const bookmark = await db.bookmark.findUnique({
    where: {
      userId_articleId: {
        userId: session.user.id,
        articleId: article.id,
      },
    },
  });

  const isBookmarked = !!bookmark;
  const compiledHtml = compileMarkdownToHtml(article.content);
  const toc = extractTableOfContents(article.content);

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <Navbar user={session.user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#626760] hover:text-[#20211f] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Feed</span>
          </Link>

          <BookmarkButton
            articleId={article.id}
            initialBookmarked={isBookmarked}
          />
        </div>

        {/* Article Header Card */}
        <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-lg bg-[#eef2ec] px-3 py-1 text-xs font-semibold text-[#596057]">
              {article.department.name}
            </span>
            {article.isPinned && (
              <span className="rounded-full bg-[#e7f2e4] px-2.5 py-0.5 text-xs font-semibold text-[#4c7649]">
                Pinned RFC
              </span>
            )}
            {article.status !== ArticleStatus.PUBLISHED && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                Status: {article.status}
              </span>
            )}
          </div>

          <h1 className="font-['Fraunces'] text-3xl font-medium tracking-tight text-[#20211f] sm:text-4xl lg:text-5xl leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-[#626760] font-normal">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t border-black/6 pt-6 text-xs text-[#737870]">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#81857e]" />
              <span className="font-semibold text-[#20211f]">
                {article.author.name}
              </span>
              <span>({article.author.department})</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#81857e]" />
              <span>
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Unpublished Draft"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#81857e]" />
              <span>{article.readTimeMinutes} min read ({article.wordCount} words)</span>
            </div>
          </div>
        </div>

        {/* Content & Sticky Table of Contents */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Markdown Body */}
          <article className="lg:col-span-8 rounded-2xl border border-black/8 bg-white p-6 sm:p-10 shadow-sm">
            <div
              className="prose max-w-none text-sm sm:text-base leading-relaxed text-[#20211f] space-y-4
                [&_h2]:font-['Fraunces'] [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-[#20211f] [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-black/6
                [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:text-[#20211f] [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:text-[#40433d] [&_p]:leading-7
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-[#40433d]
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:text-[#40433d]
                [&_code]:rounded-md [&_code]:bg-[#f2f5f0] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-[#20211f]
                [&_pre]:rounded-xl [&_pre]:bg-[#20211f] [&_pre]:p-4 [&_pre]:text-white [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-emerald-300 [&_pre_code]:p-0
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#5a8357] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#626760]
                [&_table]:w-full [&_table]:text-xs [&_table]:border-collapse [&_th]:border-b [&_th]:border-black/10 [&_th]:p-2 [&_th]:text-left [&_td]:border-b [&_td]:border-black/6 [&_td]:p-2"
              dangerouslySetInnerHTML={{ __html: compiledHtml }}
            />
          </article>

          {/* Sticky Table of Contents Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-black/8 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-black/6 pb-3">
                <List className="h-4 w-4 text-[#5a8357]" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#20211f]">
                  Table of Contents
                </h2>
              </div>

              {toc.length === 0 ? (
                <p className="text-xs text-[#737870]">
                  No section headings found in document.
                </p>
              ) : (
                <nav className="space-y-1.5 text-xs">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block rounded-lg px-2.5 py-1.5 text-[#626760] transition hover:bg-[#eef2ec] hover:text-[#20211f] ${
                        item.level === 3 ? "pl-5 text-[11px]" : "font-medium"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              )}

              <div className="border-t border-black/6 pt-4">
                <div className="rounded-xl bg-[#fbfbfa] p-3 text-[11px] text-[#737870]">
                  <p className="font-semibold text-[#20211f]">Document Metadata</p>
                  <p className="mt-1">Nexus Knowledge Identifier: {article.slug}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
