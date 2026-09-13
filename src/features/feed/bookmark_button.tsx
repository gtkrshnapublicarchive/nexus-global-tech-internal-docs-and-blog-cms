"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmarkAction } from "@/features/bookmarks/bookmarks.actions";

interface BookmarkButtonProps {
  articleId: string;
  initialBookmarked: boolean;
  size?: "sm" | "md";
}

export function BookmarkButton({
  articleId,
  initialBookmarked,
  size = "md",
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic toggle
    const nextState = !bookmarked;
    setBookmarked(nextState);

    startTransition(async () => {
      try {
        const res = await toggleBookmarkAction(articleId);
        setBookmarked(res.bookmarked);
      } catch {
        // Rollback on failure
        setBookmarked(!nextState);
      }
    });
  };

  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
      className={`group flex items-center justify-center rounded-xl border transition ${
        isSmall ? "h-8 w-8" : "h-9 w-9"
      } ${
        bookmarked
          ? "border-[#5a8357] bg-[#e7f2e4] text-[#4c7649]"
          : "border-black/8 bg-white text-[#737870] hover:border-black/20 hover:text-[#20211f]"
      }`}
    >
      <Bookmark
        className={`${isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} ${
          bookmarked ? "fill-current" : ""
        }`}
      />
    </button>
  );
}
