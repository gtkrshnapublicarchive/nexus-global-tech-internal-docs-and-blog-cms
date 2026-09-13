"use client";

import { useState } from "react";
import { History, ChevronDown } from "lucide-react";

export interface ArticleRevisionItem {
  id: string;
  version: string;
  summary: string;
  authorName: string;
  createdAt: string | Date;
}

interface ArticleChangelogProps {
  revisions: ArticleRevisionItem[];
  className?: string;
}

export function ArticleChangelog({
  revisions,
  className = "",
}: ArticleChangelogProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!revisions || revisions.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border border-black/8 bg-white p-5 shadow-sm transition ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#eef2ec] text-[#5a8357]">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-['Fraunces'] text-sm font-medium text-[#20211f]">
              Document Revision Changelog
            </h3>
            <p className="text-[11px] text-[#737870]">
              {revisions.length} tracked architectural revision{revisions.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div
          className={`shrink-0 text-[#737870] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 border-t border-black/6 pt-4 space-y-3 animate-in fade-in duration-100">
          {revisions.map((rev) => (
            <div
              key={rev.id}
              className="flex items-start gap-3 rounded-xl bg-[#fbfbfa] border border-black/6 p-3 text-xs"
            >
              <span className="shrink-0 rounded-md bg-[#252724] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                {rev.version}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#20211f] font-medium leading-relaxed">
                  {rev.summary}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-[#737870]">
                  <span>{rev.authorName}</span>
                  <span>•</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
