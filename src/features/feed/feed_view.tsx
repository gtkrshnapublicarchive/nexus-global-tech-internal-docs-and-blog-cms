"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Pin, Clock, ArrowUpRight, FileText, Sparkles, Layers, Users } from "lucide-react";
import { FeedArticleItem, DepartmentFilterItem } from "./feed_types";
import { BookmarkButton } from "./bookmark_button";

interface FeedViewProps {
  articles: FeedArticleItem[];
  departments: DepartmentFilterItem[];
}

export function FeedView({ articles, departments }: FeedViewProps) {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pinnedArticles = useMemo(() => {
    return articles.filter((a) => a.isPinned);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesDept =
        selectedDept === "all" || article.department.slug === selectedDept;

      if (!matchesDept) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q) ||
        article.department.name.toLowerCase().includes(q)
      );
    });
  }, [articles, selectedDept, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Landing Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-black/8 bg-white p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e7f2e4] px-3 py-1 text-xs font-semibold text-[#4c7649]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nexus Global Tech - Internal Engineering Hub</span>
            </div>

            <h1 className="font-['Fraunces'] text-3xl font-medium tracking-tight text-[#20211f] sm:text-5xl leading-tight">
              Centralized Architectural Knowledge & RFCs
            </h1>

            <p className="text-sm leading-relaxed text-[#626760] max-w-xl">
              The single source of truth for 200 software engineers across Aurelia City. Discover operational runbooks, system incident post-mortems, and architectural decision records.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-xl bg-[#fbfbfa] border border-black/6 px-3 py-1.5 text-xs text-[#20211f]">
                <Users className="h-3.5 w-3.5 text-[#5a8357]" />
                <span className="font-semibold">200 Active Staff</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#fbfbfa] border border-black/6 px-3 py-1.5 text-xs text-[#20211f]">
                <Layers className="h-3.5 w-3.5 text-[#5a8357]" />
                <span className="font-semibold">4 Departments</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#fbfbfa] border border-black/6 px-3 py-1.5 text-xs text-[#20211f]">
                <Clock className="h-3.5 w-3.5 text-[#5a8357]" />
                <span className="font-semibold">Weekly RFC Cadence</span>
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="pt-2">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#81857e]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guides, RFCs, authors, topics..."
                  className="w-full rounded-xl border border-black/10 bg-[#fbfbfa] py-2.5 pl-10 pr-4 text-sm text-[#20211f] placeholder:text-[#81857e] shadow-sm focus:border-[#668c63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#668c63]/20"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-black/8 bg-[#fbfbfa] shadow-sm">
              <Image
                src="/images/nexus_hero_banner.jpg"
                alt="Nexus Global Tech Architecture Network"
                fill
                priority
                className="object-cover transition duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pinned Announcements Banner (Max 2 enforced) */}
      {pinnedArticles.length > 0 && selectedDept === "all" && !searchQuery && (
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
      )}

      {/* Department Taxonomy Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-black/6">
        <button
          type="button"
          onClick={() => setSelectedDept("all")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            selectedDept === "all"
              ? "bg-[#252724] text-white"
              : "bg-white border border-black/8 text-[#626760] hover:bg-black/4 hover:text-[#20211f]"
          }`}
        >
          All Topics ({articles.length})
        </button>

        {departments.map((dept) => (
          <button
            key={dept.id}
            type="button"
            onClick={() => setSelectedDept(dept.slug)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              selectedDept === dept.slug
                ? "bg-[#252724] text-white"
                : "bg-white border border-black/8 text-[#626760] hover:bg-black/4 hover:text-[#20211f]"
            }`}
          >
            {dept.name} ({dept.count})
          </button>
        ))}
      </div>

      {/* Articles Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#737870]">
          <span>
            Showing {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
          </span>
          {searchQuery && (
            <span>Filtered by keyword: &ldquo;{searchQuery}&rdquo;</span>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-black/8 bg-white p-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-[#81857e]" />
            <h3 className="mt-3 text-sm font-semibold text-[#20211f]">
              No documentation found
            </h3>
            <p className="mt-1 text-xs text-[#737870]">
              Try adjusting your search terms or clearing the department filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition hover:border-black/16 hover:shadow-md"
              >
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
                  <div className="absolute top-3 left-3 z-10">
                    <span className="rounded-lg bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-[#596057] shadow-sm">
                      {article.department.name}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <Link href={`/articles/${article.slug}`} className="block">
                    <h3 className="font-['Fraunces'] text-lg font-medium leading-snug tracking-tight text-[#20211f] group-hover:text-[#5a8357] transition">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#626760] line-clamp-3">
                      {article.excerpt}
                    </p>
                  </Link>

                  <div className="mt-6 flex items-center justify-between border-t border-black/6 pt-4 text-[11px] text-[#737870]">
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

                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTimeMinutes} min</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
