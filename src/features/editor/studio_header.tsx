"use client";

import { Clock, FileText, Send, Save, Globe } from "lucide-react";

interface StudioHeaderProps {
  isEditing: boolean;
  isPending: boolean;
  minutes: number;
  wordCount: number;
  contentLength: number;
  onSave: (status: "DRAFT" | "IN_REVIEW" | "PUBLISHED") => void;
}

export function StudioHeader({
  isEditing,
  isPending,
  minutes,
  wordCount,
  contentLength,
  onSave,
}: StudioHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-black/8 bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#252724] text-white">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-['Fraunces'] text-xl font-medium tracking-tight text-[#20211f]">
            {isEditing ? "Edit Documentation" : "Split-Screen Markdown Studio"}
          </h2>
          <div className="flex items-center gap-3 text-xs text-[#737870]">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Est. {minutes} min read ({wordCount} words)
            </span>
            <span>•</span>
            <span className={contentLength > 45000 ? "text-amber-600 font-semibold" : ""}>
              {contentLength.toLocaleString()} / 50,000 chars
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onSave("DRAFT")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-[#20211f] transition hover:bg-black/4 active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Draft</span>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onSave("IN_REVIEW")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-[#f2f5f0] px-3.5 py-2 text-xs font-semibold text-[#486248] transition hover:bg-[#e7f2e4] active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Submit for Review</span>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onSave("PUBLISHED")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#252724] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3b3e39] active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Publish Article</span>
        </button>
      </div>
    </div>
  );
}
