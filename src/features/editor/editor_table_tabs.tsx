"use client";

import { ArticleStatus } from "@prisma/client";

export type EditorTabFilter = "ALL" | ArticleStatus;

interface EditorTableTabsProps {
  currentTab: EditorTabFilter;
  onTabChange: (tab: EditorTabFilter) => void;
  counts: Record<string, number>;
}

export function EditorTableTabs({ currentTab, onTabChange, counts }: EditorTableTabsProps) {
  const tabs: { key: EditorTabFilter; label: string; count: number; alert?: boolean }[] = [
    { key: "ALL", label: "All Documents", count: counts.ALL || 0 },
    {
      key: "IN_REVIEW",
      label: "Awaiting Review",
      count: counts.IN_REVIEW || 0,
      alert: (counts.IN_REVIEW || 0) > 0,
    },
    { key: "DRAFT", label: "Drafts", count: counts.DRAFT || 0 },
    { key: "PUBLISHED", label: "Published", count: counts.PUBLISHED || 0 },
    { key: "ARCHIVED", label: "Archived", count: counts.ARCHIVED || 0 },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto p-4 border-b border-black/6 bg-[#fbfbfa]">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
              isActive
                ? "bg-[#252724] text-white"
                : "bg-white border border-black/8 text-[#626760] hover:bg-black/4 hover:text-[#20211f]"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                isActive
                  ? "bg-white/20 text-white"
                  : tab.alert
                  ? "bg-amber-100 text-amber-800"
                  : "bg-black/5 text-[#737870]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
