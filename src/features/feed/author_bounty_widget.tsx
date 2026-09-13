"use client";

import { Award, Coins } from "lucide-react";
import { AuthorBountyLeaderboardItem } from "./feed_types";

interface AuthorBountyWidgetProps {
  authors: AuthorBountyLeaderboardItem[];
  className?: string;
}

export function AuthorBountyWidget({
  authors,
  className = "",
}: AuthorBountyWidgetProps) {
  return (
    <div
      className={`rounded-2xl border border-black/8 bg-white p-5 shadow-sm space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-black/6 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#faedd9] text-[#9c6a1e]">
            <Coins className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-['Fraunces'] text-sm font-semibold text-[#20211f]">
              Aurum Knowledge Bounties
            </h3>
            <p className="text-[10px] text-[#737870]">
              Internal technical writing recognitions
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#faedd9] px-2 py-0.5 text-[10px] font-bold text-[#8f5e13]">
          AUR Pool
        </span>
      </div>

      <div className="space-y-2">
        {authors.map((author, index) => (
          <div
            key={author.id}
            className="flex items-center justify-between rounded-xl bg-[#fbfbfa] border border-black/5 p-2.5 transition hover:border-black/15"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/5 font-mono text-[10px] font-semibold text-[#626760]">
                {index + 1}
              </span>
              <div className="truncate">
                <span className="text-xs font-semibold text-[#20211f] block truncate">
                  {author.name}
                </span>
                <span className="text-[10px] text-[#737870] block">
                  {author.department} • {author.articleCount} posts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 pl-2">
              <Award className="h-3.5 w-3.5 text-[#9c6a1e]" />
              <span className="font-mono text-xs font-bold text-[#8f5e13]">
                {author.aurumBalance} AUR
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-black/6 pt-2 text-[10px] text-[#737870] leading-relaxed">
        Staff earn 100-200 AUR bounties upon publication of accepted RFCs, incident post-mortems, and operational runbooks.
      </div>
    </div>
  );
}
