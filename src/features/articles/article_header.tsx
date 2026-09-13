"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Award } from "lucide-react";
import { ArticleStatus, DocumentType } from "@prisma/client";
import { BookmarkButton } from "@/features/feed/bookmark_button";
import { DocumentTypeBadge } from "@/shared/ui/document_type_badge";
import { DocumentFreshnessBadge } from "@/shared/ui/document_freshness_badge";
import { ShareInternalLinkButton } from "@/shared/ui/share_internal_link_button";

interface ArticleHeaderProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    documentType: DocumentType;
    lastVerifiedAt: Date | null;
    aurumBounty: number;
    isPinned: boolean;
    status: ArticleStatus;
    readTimeMinutes: number;
    wordCount: number;
    publishedAt: Date | null;
    department: { name: string };
    author: { name: string; department: string };
  };
  isBookmarked: boolean;
  canReverify: boolean;
}

export function ArticleHeader({ article, isBookmarked, canReverify }: ArticleHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#626760] hover:text-[#20211f] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Feed</span>
        </Link>

        <div className="flex items-center gap-2">
          <ShareInternalLinkButton title={article.title} slug={article.slug} />
          <BookmarkButton articleId={article.id} initialBookmarked={isBookmarked} />
        </div>
      </div>

      {/* Freshness Sentinel Alert */}
      <DocumentFreshnessBadge
        articleId={article.id}
        lastVerifiedAt={article.lastVerifiedAt}
        canReverify={canReverify}
      />

      {/* Article Header Card */}
      <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-[#eef2ec] px-3 py-1 text-xs font-semibold text-[#596057]">
            {article.department.name}
          </span>
          <DocumentTypeBadge type={article.documentType} />
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

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/6 pt-6 text-xs text-[#737870]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#81857e]" />
              <span className="font-semibold text-[#20211f]">{article.author.name}</span>
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

          <div className="flex items-center gap-1 font-semibold text-[#8f5e13] bg-[#fbf5eb] px-3 py-1.5 rounded-xl border border-[#ecdac4]">
            <Award className="h-3.5 w-3.5 text-[#9c6a1e]" />
            <span>{article.aurumBounty} AUR Bounty</span>
          </div>
        </div>
      </div>
    </div>
  );
}
