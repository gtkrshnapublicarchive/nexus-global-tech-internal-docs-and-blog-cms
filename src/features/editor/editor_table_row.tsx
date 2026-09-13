"use client";

import Link from "next/link";
import { ArticleStatus, DocumentType } from "@prisma/client";
import { DocumentTypeBadge } from "@/shared/ui/document_type_badge";
import { SelectDropdown, SelectOption } from "@/shared/ui/select_dropdown";
import { Pin, Trash2, Edit, ExternalLink, Check, Award } from "lucide-react";

export interface ManagedArticle {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  documentType: DocumentType;
  aurumBounty: number;
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

interface EditorTableRowProps {
  item: ManagedArticle;
  isPending: boolean;
  onStatusChange: (id: string, status: ArticleStatus) => void;
  onTogglePin: (id: string, currentPin: boolean) => void;
  onDelete: (id: string) => void;
}

export function EditorTableRow({
  item,
  isPending,
  onStatusChange,
  onTogglePin,
  onDelete,
}: EditorTableRowProps) {
  return (
    <tr className="hover:bg-[#fbfbfa]/70 transition">
      <td className="p-3.5">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-[#20211f]">{item.title}</div>
          <DocumentTypeBadge type={item.documentType} size="sm" />
        </div>
        <div className="text-[11px] text-[#737870] mt-0.5">
          {item.department.name} • {item.slug}
        </div>
      </td>

      <td className="p-3.5 text-[#626760]">{item.author.name}</td>

      <td className="p-3.5">
        <div className="inline-flex items-center gap-1 font-semibold text-[#8f5e13] bg-[#fbf5eb] px-2.5 py-1 rounded-lg border border-[#ecdac4] text-[11px]">
          <Award className="h-3 w-3 text-[#9c6a1e]" />
          <span>{item.aurumBounty} AUR</span>
        </div>
      </td>

      <td className="p-3.5">
        <div className="flex items-center gap-2">
          <SelectDropdown
            disabled={isPending}
            size="sm"
            className="w-32"
            options={STATUS_OPTIONS}
            value={item.status}
            onChange={(newStatus) => onStatusChange(item.id, newStatus as ArticleStatus)}
          />

          {item.status === ArticleStatus.IN_REVIEW && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onStatusChange(item.id, ArticleStatus.PUBLISHED)}
              className="inline-flex items-center gap-1 rounded-lg bg-[#e7f2e4] border border-[#5a8357]/30 px-2 py-1 text-[11px] font-semibold text-[#3b6038] hover:bg-[#d9ebd5] transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="Approve & Publish Immediately"
            >
              <Check className="h-3 w-3 text-[#5a8357]" />
              <span>Approve</span>
            </button>
          )}
        </div>
      </td>

      <td className="p-3.5 text-center">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onTogglePin(item.id, item.isPinned)}
          title={item.isPinned ? "Unpin Article" : "Pin to Top Banner"}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition cursor-pointer ${
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
            onClick={() => onDelete(item.id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
            title="Delete Article"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
