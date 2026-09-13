"use client";

import { DocumentType } from "@prisma/client";
import { SelectDropdown } from "@/shared/ui/select_dropdown";
import { DOCUMENT_TYPE_SELECT_OPTIONS, DepartmentOption } from "./editor_types";

interface StudioMetadataFormProps {
  title: string;
  setTitle: (v: string) => void;
  departmentId: string;
  setDepartmentId: (v: string) => void;
  documentType: DocumentType;
  setDocumentType: (v: DocumentType) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  coverImageUrl: string;
  setCoverImageUrl: (v: string) => void;
  revisionSummary: string;
  setRevisionSummary: (v: string) => void;
  isPinned: boolean;
  setIsPinned: (v: boolean) => void;
  fieldErrors: Record<string, string>;
  clearFieldError: (field: string) => void;
  departments: DepartmentOption[];
}

export function StudioMetadataForm({
  title,
  setTitle,
  departmentId,
  setDepartmentId,
  documentType,
  setDocumentType,
  excerpt,
  setExcerpt,
  coverImageUrl,
  setCoverImageUrl,
  revisionSummary,
  setRevisionSummary,
  isPinned,
  setIsPinned,
  fieldErrors,
  clearFieldError,
  departments,
}: StudioMetadataFormProps) {
  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
      <div className="md:col-span-8 space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">Document Title *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (fieldErrors.title) clearFieldError("title");
          }}
          placeholder="e.g. RFC-106: Redis Cluster Failover Automation"
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#20211f] focus:outline-none focus:ring-2 ${
            fieldErrors.title ? "border-red-300 focus:border-red-400 focus:ring-red-400/20" : "border-black/10 focus:border-[#668c63] focus:ring-[#668c63]/20"
          }`}
        />
        {fieldErrors.title && <p className="text-[11px] font-medium text-red-600">{fieldErrors.title}</p>}
      </div>

      <div className="md:col-span-4 space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">Department *</label>
        <SelectDropdown options={deptOptions} value={departmentId} onChange={setDepartmentId} />
      </div>

      <div className="md:col-span-6 space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">Archetype & Bounty *</label>
        <SelectDropdown options={DOCUMENT_TYPE_SELECT_OPTIONS} value={documentType} onChange={(v) => setDocumentType(v as DocumentType)} />
      </div>

      <div className="md:col-span-6 space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">Cover Image URL (Optional)</label>
        <input
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="/images/architecture_cover.jpg or https://..."
          className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-sm text-[#20211f] focus:border-[#668c63] focus:outline-none focus:ring-2 focus:ring-[#668c63]/20"
        />
      </div>

      <div className="md:col-span-12 space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">Summary Excerpt *</label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => {
            setExcerpt(e.target.value);
            if (fieldErrors.excerpt) clearFieldError("excerpt");
          }}
          placeholder="A concise description rendered in the reader feed..."
          className={`w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-[#20211f] focus:outline-none focus:ring-2 ${
            fieldErrors.excerpt ? "border-red-300 focus:border-red-400 focus:ring-red-400/20" : "border-black/10 focus:border-[#668c63] focus:ring-[#668c63]/20"
          }`}
        />
        {fieldErrors.excerpt && <p className="text-[11px] font-medium text-red-600">{fieldErrors.excerpt}</p>}
      </div>

      <div className="md:col-span-8 space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">Revision Changelog Note (Optional)</label>
        <input
          type="text"
          value={revisionSummary}
          onChange={(e) => setRevisionSummary(e.target.value)}
          placeholder="e.g. Updated Envoy proxy timeouts and ratelimit filter configuration"
          className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-sm text-[#20211f] focus:border-[#668c63] focus:outline-none focus:ring-2 focus:ring-[#668c63]/20"
        />
      </div>

      <div className="md:col-span-4 flex items-center pt-6">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="h-4 w-4 rounded-[5px] border border-black/20 bg-white text-[#252724] accent-[#252724] focus:ring-2 focus:ring-[#668c63]/40 cursor-pointer"
          />
          <span className="text-xs font-semibold text-[#20211f]">Pin Announcement (Banner, max 2)</span>
        </label>
      </div>
    </div>
  );
}
