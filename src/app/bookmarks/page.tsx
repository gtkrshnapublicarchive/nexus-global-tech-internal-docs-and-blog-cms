import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/core/auth/auth";
import { db } from "@/core/database/db";
import { Navbar } from "@/shared/ui/navbar";
import { BookmarkButton } from "@/features/feed/bookmark_button";
import { Bookmark, Clock, ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "My Saved Bookmarks - Nexus Knowledge",
  description: "Personal saved technical articles and onboarding SOPs",
};

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const bookmarks = await db.bookmark.findMany({
    where: { userId: session.user.id },
    include: {
      article: {
        include: {
          author: {
            select: { name: true, department: true },
          },
          department: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <Navbar user={session.user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-black/8 pb-6">
          <div className="space-y-1">
            <Link
              href="/feed"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#626760] hover:text-[#20211f] transition mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Feed</span>
            </Link>
            <h1 className="font-['Fraunces'] text-3xl font-medium tracking-tight text-[#20211f]">
              Saved Documentation ({bookmarks.length})
            </h1>
            <p className="text-xs text-[#737870]">
              Personal offline reference list saved for your engineering sessions.
            </p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-2xl border border-black/8 bg-white p-12 text-center max-w-md mx-auto">
            <Bookmark className="mx-auto h-8 w-8 text-[#81857e]" />
            <h3 className="mt-3 text-sm font-semibold text-[#20211f]">
              No saved bookmarks yet
            </h3>
            <p className="mt-1 text-xs text-[#737870]">
              Click the bookmark icon on any guide or RFC in the feed to pin it here.
            </p>
            <div className="mt-6">
              <Link
                href="/feed"
                className="inline-flex rounded-xl bg-[#252724] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3b3e39]"
              >
                Browse Company Feed
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map(({ article }) => (
              <div
                key={article.id}
                className="flex flex-col justify-between rounded-2xl border border-black/8 bg-white p-6 shadow-sm transition hover:border-black/16 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-[#eef2ec] px-2.5 py-1 text-[11px] font-semibold text-[#596057]">
                      {article.department.name}
                    </span>
                    <BookmarkButton
                      articleId={article.id}
                      initialBookmarked={true}
                      size="sm"
                    />
                  </div>

                  <Link href={`/articles/${article.slug}`} className="block group">
                    <h3 className="font-['Fraunces'] text-lg font-medium leading-snug tracking-tight text-[#20211f] group-hover:text-[#5a8357] transition">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#626760] line-clamp-3">
                      {article.excerpt}
                    </p>
                  </Link>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-black/6 pt-4 text-[11px] text-[#737870]">
                  <span className="font-semibold text-[#20211f]">
                    {article.author.name}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTimeMinutes} min
                    </span>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-0.5 font-semibold text-[#252724] hover:underline"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
