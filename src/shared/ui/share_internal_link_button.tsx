"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareInternalLinkButtonProps {
  title: string;
  slug: string;
  className?: string;
}

export function ShareInternalLinkButton({
  title,
  slug,
  className = "",
}: ShareInternalLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/articles/${slug}`;
    const citation = `[${title} - Nexus Knowledge Base](${url})`;

    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy internal markdown reference for Slack or Teams"
      className={`inline-flex items-center gap-1.5 rounded-xl border border-black/8 bg-white px-3 py-1.5 text-xs font-semibold text-[#626760] shadow-sm transition hover:border-black/20 hover:bg-[#fbfbfa] hover:text-[#20211f] ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[#5a8357]" />
          <span className="text-[#5a8357]">Copied Citation</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-[#737870]" />
          <span>Share Reference</span>
        </>
      )}
    </button>
  );
}
