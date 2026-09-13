"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  togglePinAction,
  updateArticleStatusAction,
  deleteArticleAction,
} from "@/features/articles/articles.actions";
import { SelectDropdown, SelectOption } from "@/shared/ui/select_dropdown";
import { Pin, Trash2, Edit, ExternalLink } from "lucide-react";
import { ArticleStatus } from "@prisma/client";

interface ManagedArticle {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  isPinned: boolean;
  department: { name: string };
  author: { name: string };
  createdAt: string;
  publishedAt: string | null;
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

interface EditorTableProps {
  articles: ManagedArticle[];
}

export function EditorTable({ articles }: EditorTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
    if (!confirm("Are you sure you want to permanently delete this article?")) {
      return;
    }

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
            Editorial Article Desk
          </h3>
          <p className="text-xs text-[#737870]">
            Review, promote, and manage company documentation lifecycle states.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#5a8357]">
          {articles.length} Total Articles
        </span>
      </div>

      <div className="overflow-x-auto min-h-[360px] pb-16">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#fbfbfa] text-[#686d66] border-b border-black/6">
            <tr>
              <th className="p-3.5 font-semibold">Title & Department</th>
              <th className="p-3.5 font-semibold">Author</th>
              <th className="p-3.5 font-semibold">State</th>
              <th className="p-3.5 font-semibold text-center">Pinned</th>
              <th className="p-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/6">
            {articles.map((item) => (
              <tr key={item.id} className="hover:bg-[#fbfbfa]/70 transition">
                <td className="p-3.5">
                  <div className="font-semibold text-[#20211f]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#737870]">
                    {item.department.name} • {item.slug}
                  </div>
                </td>

                <td className="p-3.5 text-[#626760]">
                  {item.author.name}
                </td>

                <td className="p-3.5">
                  <SelectDropdown
                    disabled={isPending}
                    size="sm"
                    className="w-32"
                    options={STATUS_OPTIONS}
                    value={item.status}
                    onChange={(newStatus) =>
                      handleStatusChange(item.id, newStatus as ArticleStatus)
                    }
                  />
                </td>

                <td className="p-3.5 text-center">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleTogglePin(item.id, item.isPinned)}
                    title={item.isPinned ? "Unpin Article" : "Pin to Top Banner"}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                      item.isPinned
                        ? "border-[#5a8357] bg-[#e7f2e4] text-[#4c7649]"
                        : "border-black/10 bg-white text-[#81857e] hover:border-black/25"
                    }`}
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </button>
                </td>

                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/articles/${item.slug}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-black/8 text-[#626760] hover:bg-black/5"
                      title="View Article"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href={`/editor?id=${item.id}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-black/8 text-[#626760] hover:bg-black/5"
                      title="Edit in Studio"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      title="Delete Article"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
