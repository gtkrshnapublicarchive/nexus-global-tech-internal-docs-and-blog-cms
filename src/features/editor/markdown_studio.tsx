"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { compileMarkdownToHtml } from "@/shared/lib/markdown";
import { calculateReadTime } from "@/shared/lib/read_time";
import { saveArticleAction } from "@/features/articles/articles.actions";
import { SelectDropdown } from "@/shared/ui/select_dropdown";
import { FeedbackAlert } from "@/shared/ui/feedback_alert";
import { FormIssue, parseErrorMessage } from "@/shared/lib/format_error";
import { Clock, FileText, Send, Save, Globe } from "lucide-react";

interface DepartmentOption {
  id: string;
  name: string;
}

interface MarkdownStudioProps {
  departments: DepartmentOption[];
  initialArticle?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    departmentId: string;
    coverImageUrl?: string | null;
    isPinned: boolean;
    status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  };
}

export function MarkdownStudio({
  departments,
  initialArticle,
}: MarkdownStudioProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt ?? "");
  const [content, setContent] = useState(
    initialArticle?.content ?? "## Technical Overview\n\nStart writing technical specs..."
  );
  const [departmentId, setDepartmentId] = useState(
    initialArticle?.departmentId ?? (departments[0]?.id || "")
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialArticle?.coverImageUrl ?? ""
  );
  const [isPinned, setIsPinned] = useState(initialArticle?.isPinned ?? false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title?: string;
    message: string;
    issues?: FormIssue[];
  } | null>(null);

  const fieldErrors = useMemo(() => {
    if (feedback?.type !== "error" || !feedback.issues) return {};
    const map: Record<string, string> = {};
    for (const issue of feedback.issues) {
      if (issue.field && !map[issue.field]) {
        map[issue.field] = issue.message;
      }
    }
    return map;
  }, [feedback]);

  const { minutes, wordCount } = useMemo(
    () => calculateReadTime(content),
    [content]
  );
  const compiledHtml = useMemo(() => compileMarkdownToHtml(content), [content]);

  const handleSave = (targetStatus: "DRAFT" | "IN_REVIEW" | "PUBLISHED") => {
    setFeedback(null);

    if (content.length > 50000) {
      setFeedback({
        type: "error",
        title: "Content Too Long",
        message: "Article length exceeds the maximum limit of 50,000 characters.",
        issues: [
          { field: "content", message: "Content exceeds 50,000 characters" },
        ],
      });
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          id: initialArticle?.id,
          title,
          excerpt,
          content,
          departmentId,
          coverImageUrl: coverImageUrl || undefined,
          status: targetStatus,
          isPinned,
        };

        const res = await saveArticleAction(payload);
        if (!res.success) {
          setFeedback({
            type: "error",
            title: "Validation Incomplete",
            message: res.error || "Please review and correct the marked items.",
            issues: res.issues || [],
          });
          return;
        }

        setFeedback({
          type: "success",
          title: "Article Saved",
          message: `Article successfully saved in ${targetStatus} state!`,
        });

        if (!initialArticle && res?.slug) {
          router.push(`/articles/${res.slug}`);
        } else {
          router.refresh();
        }
      } catch (err: unknown) {
        const parsed = parseErrorMessage(err);
        setFeedback({
          type: "error",
          title: "Submission Issue",
          message: parsed.summary,
          issues: parsed.issues,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-black/8 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#252724] text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-['Fraunces'] text-xl font-medium tracking-tight text-[#20211f]">
              {initialArticle ? "Edit Article" : "Split-Screen Markdown Studio"}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#737870]">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Est. {minutes} min read ({wordCount} words)
              </span>
              <span>•</span>
              <span className={content.length > 45000 ? "text-amber-600 font-semibold" : ""}>
                {content.length.toLocaleString()} / 50,000 chars
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave("DRAFT")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-[#20211f] transition hover:bg-black/4 active:scale-98 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave("IN_REVIEW")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-[#f2f5f0] px-3.5 py-2 text-xs font-semibold text-[#486248] transition hover:bg-[#e7f2e4] active:scale-98 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit for Review</span>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave("PUBLISHED")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#252724] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3b3e39] active:scale-98 disabled:opacity-50"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <FeedbackAlert
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          issues={feedback.issues}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Metadata Configuration Box */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
        <div className="md:col-span-8 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">
            Article Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) {
                setFeedback((prev) =>
                  prev
                    ? {
                        ...prev,
                        issues: prev.issues?.filter((i) => i.field !== "title"),
                      }
                    : null
                );
              }
            }}
            placeholder="e.g. RFC-106: Redis Cluster Failover Automation"
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#20211f] placeholder:text-[#a0a59e] focus:outline-none focus:ring-2 ${
              fieldErrors.title
                ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
                : "border-black/10 focus:border-[#668c63] focus:ring-[#668c63]/20"
            }`}
          />
          {fieldErrors.title && (
            <p className="text-[11px] font-medium text-red-600">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">
            Department *
          </label>
          <SelectDropdown
            options={departments.map((dept) => ({
              value: dept.id,
              label: dept.name,
            }))}
            value={departmentId}
            onChange={setDepartmentId}
          />
        </div>

        <div className="md:col-span-12 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">
            Summary Excerpt *
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              if (fieldErrors.excerpt) {
                setFeedback((prev) =>
                  prev
                    ? {
                        ...prev,
                        issues: prev.issues?.filter((i) => i.field !== "excerpt"),
                      }
                    : null
                );
              }
            }}
            placeholder="A concise description rendered in the reader feed..."
            className={`w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-[#20211f] placeholder:text-[#a0a59e] focus:outline-none focus:ring-2 ${
              fieldErrors.excerpt
                ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
                : "border-black/10 focus:border-[#668c63] focus:ring-[#668c63]/20"
            }`}
          />
          {fieldErrors.excerpt && (
            <p className="text-[11px] font-medium text-red-600">
              {fieldErrors.excerpt}
            </p>
          )}
        </div>

        <div className="md:col-span-8 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">
            Cover Image URL (Optional)
          </label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-sm text-[#20211f] placeholder:text-[#a0a59e] focus:border-[#668c63] focus:outline-none focus:ring-2 focus:ring-[#668c63]/20"
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
            <span className="text-xs font-semibold text-[#20211f]">
              Pin Announcement (Top Banner, max 2)
            </span>
          </label>
        </div>
      </div>

      {/* Split-Screen Editor & Live Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Pane: Raw Markdown Textarea */}
        <div className="flex flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between border-b border-black/6 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">
              Markdown Raw Source
            </span>
            <span className="text-[11px] text-[#737870]">GitHub Flavored (GFM)</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (fieldErrors.content) {
                setFeedback((prev) =>
                  prev
                    ? {
                        ...prev,
                        issues: prev.issues?.filter((i) => i.field !== "content"),
                      }
                    : null
                );
              }
            }}
            rows={22}
            className={`w-full font-mono text-xs leading-relaxed text-[#20211f] bg-[#fbfbfa] p-4 rounded-xl border focus:outline-none focus:ring-2 resize-y ${
              fieldErrors.content
                ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
                : "border-black/8 focus:border-[#668c63] focus:ring-[#668c63]/20"
            }`}
            placeholder="Write your markdown content..."
          />
          {fieldErrors.content && (
            <p className="mt-2 text-[11px] font-medium text-red-600">
              {fieldErrors.content}
            </p>
          )}
        </div>

        {/* Right Pane: Live HTML Preview */}
        <div className="flex flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between border-b border-black/6 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">
              Live Formatted Preview
            </span>
            <span className="text-[11px] text-[#5a8357] font-semibold">Real-Time Sync</span>
          </div>

          <div className="overflow-y-auto rounded-xl border border-black/6 bg-[#fbfbfa] p-5 h-[520px]">
            <div
              className="prose max-w-none text-xs sm:text-sm leading-relaxed text-[#20211f] space-y-3
                [&_h2]:font-['Fraunces'] [&_h2]:text-xl [&_h2]:font-medium [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-black/6
                [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-4 [&_h3]:mb-1
                [&_p]:text-[#40433d] [&_p]:leading-6
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
                [&_code]:rounded [&_code]:bg-white [&_code]:border [&_code]:border-black/10 [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs
                [&_pre]:rounded-lg [&_pre]:bg-[#20211f] [&_pre]:p-3 [&_pre]:text-white [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-emerald-300 [&_pre_code]:p-0
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#5a8357] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[#626760]"
              dangerouslySetInnerHTML={{ __html: compiledHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
