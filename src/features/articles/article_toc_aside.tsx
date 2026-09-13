"use client";

import { List } from "lucide-react";
import { TocItem } from "@/shared/lib/toc";

interface ArticleTocAsideProps {
  toc: TocItem[];
  slug: string;
}

export function ArticleTocAside({ toc, slug }: ArticleTocAsideProps) {
  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-24 rounded-2xl border border-black/8 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-black/6 pb-3">
          <List className="h-4 w-4 text-[#5a8357]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#20211f]">
            Table of Contents
          </h2>
        </div>

        {toc.length === 0 ? (
          <p className="text-xs text-[#737870]">
            No section headings found in document.
          </p>
        ) : (
          <nav className="space-y-1.5 text-xs">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block rounded-lg px-2.5 py-1.5 text-[#626760] transition hover:bg-[#eef2ec] hover:text-[#20211f] ${
                  item.level === 3 ? "pl-5 text-[11px]" : "font-medium"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}

        <div className="border-t border-black/6 pt-4">
          <div className="rounded-xl bg-[#fbfbfa] p-3 text-[11px] text-[#737870]">
            <p className="font-semibold text-[#20211f]">Document Metadata</p>
            <p className="mt-1">Nexus Knowledge Identifier: {slug}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
