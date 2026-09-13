"use client";

import Link from "next/link";
import Image from "next/image";
import { Pin, Clock, ArrowUpRight } from "lucide-react";
import { FeedArticleItem } from "./feed_types";
import { BookmarkButton } from "./bookmark_button";

interface FeedPinnedSectionProps {
  pinnedArticles: FeedArticleItem[];
}

export function FeedPinnedSection({ pinnedArticles }: FeedPinnedSectionProps) {
  if (pinnedArticles.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Pin className="h-4 w-4 text-[#5a8357]" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#20211f]">
          Pinned Announcements ({pinnedArticles.length}/2)
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {pinnedArticles.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition hover:border-[#668c63] hover:shadow-md"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-[#fbfbfa]">
              <Image
                src={item.coverImageUrl || "/images/architecture_cover.jpg"}
                alt={item.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 z-10">
                <BookmarkButton
                  articleId={item.id}
                  initialBookmarked={item.isBookmarked}
                  size="sm"
                />
              </div>
              <div className="absolute bottom-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-[#4c7649] shadow-sm">
                  <Pin className="h-3 w-3" />
                  Pinned Announcement
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5a8357]">
                  {item.department.name}
                </span>
                <Link href={`/articles/${item.slug}`} className="block mt-1">
                  <h3 className="font-['Fraunces'] text-xl font-medium tracking-tight text-[#20211f] group-hover:text-[#5a8357] transition">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#626760] line-clamp-2">
                    {item.excerpt}
                  </p>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-black/6 pt-4 text-[11px] text-[#737870]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#20211f]">
                    {item.author.name}
                  </span>
                  <span>•</span>
                  <span>{item.department.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.readTimeMinutes} min read
                  </span>
                  <Link
                    href={`/articles/${item.slug}`}
                    className="inline-flex items-center gap-0.5 font-semibold text-[#252724] hover:underline"
                  >
                    <span>Read</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
