"use client";

import { AuthorBountyWidget } from "./author_bounty_widget";
import { AuthorBountyLeaderboardItem } from "./feed_types";

interface FeedSlaAsideProps {
  leaderboard?: AuthorBountyLeaderboardItem[];
}

export function FeedSlaAside({ leaderboard = [] }: FeedSlaAsideProps) {
  return (
    <aside className="space-y-6 lg:col-span-4">
      {leaderboard.length > 0 && (
        <AuthorBountyWidget authors={leaderboard} />
      )}

      {/* Verification SLA Box */}
      <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#eef2ec] text-[#5a8357] font-bold">
            ✓
          </span>
          <h4 className="font-['Fraunces'] text-sm font-medium text-[#20211f]">
            Documentation Freshness SLA
          </h4>
        </div>
        <p className="text-[#626760] leading-relaxed text-[11px]">
          Nexus Global Tech enforces a mandatory 180-day verification cycle for all production runbooks and RFCs. Unverified documents display an amber alert warning engineers of potential configuration drift.
        </p>
        <div className="rounded-xl bg-[#fbfbfa] border border-black/5 p-3 text-[10px] text-[#737870] space-y-1">
          <div>• RFCs & ADRs: Reviewed by Architecture Guild</div>
          <div>• Runbooks: Reviewed by SRE & Data Platform</div>
          <div>• Bounties: Awarded automatically upon approval</div>
        </div>
      </div>
    </aside>
  );
}
