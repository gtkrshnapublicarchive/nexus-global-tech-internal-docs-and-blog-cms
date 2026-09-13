"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Award } from "lucide-react";
import { FeedArticleItem } from "./feed_types";
import { BookmarkButton } from "./bookmark_button";
import { DocumentTypeBadge } from "@/shared/ui/document_type_badge";

interface FeedArticleCardProps {
  article: FeedArticleItem;
}

export function FeedArticleCard({ article }: FeedArticleCardProps) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition hover:border-black/16 hover:shadow-md">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#fbfbfa]">
        <Image
          src={article.coverImageUrl || "/images/architecture_cover.jpg"}
          alt={article.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-10">
          <BookmarkButton
            articleId={article.id}
            initialBookmarked={article.isBookmarked}
            size="sm"
          />
        </div>
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
          <span className="rounded-lg bg-white/95 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-[#596057] shadow-sm">
            {article.department.name}
          </span>
          <DocumentTypeBadge type={article.documentType} size="sm" />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <Link href={`/articles/${article.slug}`} className="block">
          <h3 className="font-['Fraunces'] text-lg font-medium leading-snug tracking-tight text-[#20211f] group-hover:text-[#5a8357] transition">
            {article.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#626760] line-clamp-3">
            {article.excerpt}
          </p>
        </Link>

        <div className="mt-4 flex items-center justify-between border-t border-black/6 pt-3 text-[11px] text-[#737870]">
          <div className="flex flex-col">
            <span className="font-semibold text-[#20211f]">
              {article.author.name}
            </span>
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Draft"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTimeMinutes} min</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-[#8f5e13]">
              <Award className="h-3.5 w-3.5 text-[#9c6a1e]" />
              <span>{article.aurumBounty} AUR</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
