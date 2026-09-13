"use client";

import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import { FeedArticleItem, DepartmentFilterItem, AuthorBountyLeaderboardItem } from "./feed_types";
import { ArchetypeFilterBar } from "./archetype_filter_bar";
import { FeedHero } from "./feed_hero";
import { FeedPinnedSection } from "./feed_pinned_section";
import { FeedArticleCard } from "./feed_article_card";
import { FeedSlaAside } from "./feed_sla_aside";

interface FeedViewProps {
  articles: FeedArticleItem[];
  departments: DepartmentFilterItem[];
  leaderboard?: AuthorBountyLeaderboardItem[];
}

export function FeedView({ articles, departments, leaderboard = [] }: FeedViewProps) {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pinnedArticles = useMemo(() => {
    return articles.filter((a) => a.isPinned);
  }, [articles]);

  const archetypeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: articles.length };
    for (const a of articles) {
      counts[a.documentType] = (counts[a.documentType] || 0) + 1;
    }
    return counts;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesDept =
        selectedDept === "all" || article.department.slug === selectedDept;
      if (!matchesDept) return false;

      const matchesArchetype =
        selectedArchetype === "all" || article.documentType === selectedArchetype;
      if (!matchesArchetype) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q) ||
        article.department.name.toLowerCase().includes(q) ||
        article.documentType.toLowerCase().includes(q)
      );
    });
  }, [articles, selectedDept, selectedArchetype, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <FeedHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {pinnedArticles.length > 0 && selectedDept === "all" && !searchQuery && (
        <FeedPinnedSection pinnedArticles={pinnedArticles} />
      )}

      {/* Taxonomy & Filter Bar */}
      <div className="space-y-3 border-b border-black/6 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
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

        <ArchetypeFilterBar
          selectedArchetype={selectedArchetype}
          onChange={setSelectedArchetype}
          counts={archetypeCounts}
        />
      </div>

      {/* Main Feed Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <section className="space-y-4 lg:col-span-8">
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
                Try adjusting your search terms or clearing the active filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filteredArticles.map((article) => (
                <FeedArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        <FeedSlaAside leaderboard={leaderboard} />
      </div>
    </div>
  );
}
