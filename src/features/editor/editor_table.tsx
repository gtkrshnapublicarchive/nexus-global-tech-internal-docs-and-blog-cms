"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArticleStatus } from "@prisma/client";
import {
  togglePinAction,
  updateArticleStatusAction,
  deleteArticleAction,
} from "@/features/articles/articles.actions";
import { EditorTableTabs, EditorTabFilter } from "./editor_table_tabs";
import { EditorTableRow, ManagedArticle } from "./editor_table_row";
import { FileText } from "lucide-react";

interface EditorTableProps {
  articles: ManagedArticle[];
}

export function EditorTable({ articles }: EditorTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentTab, setCurrentTab] = useState<EditorTabFilter>("ALL");

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: articles.length };
    for (const a of articles) {
      map[a.status] = (map[a.status] || 0) + 1;
    }
    return map;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (currentTab === "ALL") return articles;
    return articles.filter((a) => a.status === currentTab);
  }, [articles, currentTab]);

  const handleTogglePin = (id: string, currentPin: boolean) => {
    startTransition(async () => {
      await togglePinAction(id, !currentPin);
      router.refresh();
    });
  };

  const handleStatusChange = (id: string, newStatus: ArticleStatus) => {
    startTransition(async () => {
      await updateArticleStatusAction(id, newStatus);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;
    startTransition(async () => {
      await deleteArticleAction(id);
      router.refresh();
    });
  };

  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/6 flex items-center justify-between">
        <div>
          <h3 className="font-['Fraunces'] text-lg font-medium text-[#20211f]">
            Editorial Review Desk
          </h3>
          <p className="text-xs text-[#737870]">
            Review, promote, and manage company documentation lifecycle states and bounties.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#5a8357]">
          {articles.length} Total Articles
        </span>
      </div>

      <EditorTableTabs currentTab={currentTab} onTabChange={setCurrentTab} counts={counts} />

      <div className="overflow-x-auto min-h-[360px] pb-16">
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-[#81857e]" />
            <h4 className="mt-3 text-sm font-semibold text-[#20211f]">No documents in this queue</h4>
            <p className="mt-1 text-xs text-[#737870]">
              There are no documents matching the selected &ldquo;{currentTab}&rdquo; filter.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fbfbfa] text-[#686d66] border-b border-black/6">
              <tr>
                <th className="p-3.5 font-semibold">Title & Department</th>
                <th className="p-3.5 font-semibold">Author</th>
                <th className="p-3.5 font-semibold">Bounty</th>
                <th className="p-3.5 font-semibold">State & Quick Action</th>
                <th className="p-3.5 font-semibold text-center">Pinned</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {filteredArticles.map((item) => (
                <EditorTableRow
                  key={item.id}
                  item={item}
                  isPending={isPending}
                  onStatusChange={handleStatusChange}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
