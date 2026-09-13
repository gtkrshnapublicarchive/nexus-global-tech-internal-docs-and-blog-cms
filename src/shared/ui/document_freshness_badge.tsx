"use client";

import { ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { useTransition } from "react";
import { reverifyArticleAction } from "@/features/articles/articles.actions";
import { useRouter } from "next/navigation";

interface DocumentFreshnessBadgeProps {
  articleId: string;
  lastVerifiedAt: string | Date | null;
  verifiedBy?: string | null;
  canReverify?: boolean;
  className?: string;
}

export function DocumentFreshnessBadge({
  articleId,
  lastVerifiedAt,
  verifiedBy,
  canReverify = false,
  className = "",
}: DocumentFreshnessBadgeProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!lastVerifiedAt) {
    return null;
  }

  const verifiedDate = new Date(lastVerifiedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - verifiedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isStale = diffDays > 180;

  const handleReverify = () => {
    startTransition(async () => {
      await reverifyArticleAction(articleId);
      router.refresh();
    });
  };

  if (isStale) {
    return (
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#fae2c8] bg-[#fdf8f2] p-4 text-xs shadow-sm ${className}`}
      >
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#faedd9] text-[#9c6a1e]">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-[#7d5214]">
              Review Required: Documentation Staleness Notice
            </span>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#8f6629]">
              This operational post has not been formally verified in {diffDays} days (last checked {verifiedDate.toLocaleDateString()} by {verifiedBy ?? "Engineering Guild"}). Verify technical configurations before applying in production environments.
            </p>
          </div>
        </div>

        {canReverify && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleReverify}
            className="inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 rounded-xl bg-[#252724] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3b3e39] disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
            <span>Re-verify Now</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl border border-[#d5e7d1] bg-[#f5f9f4] px-3 py-1.5 text-xs text-[#20211f] shadow-sm ${className}`}
    >
      <ShieldCheck className="h-3.5 w-3.5 text-[#5a8357] shrink-0" />
      <span className="text-[11px] text-[#415e3e]">
        <strong className="font-semibold">Verified Active</strong> (reviewed {verifiedDate.toLocaleDateString()}{verifiedBy ? ` by ${verifiedBy}` : ""})
      </span>
    </div>
  );
}
