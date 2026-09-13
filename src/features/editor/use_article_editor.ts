"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DocumentType, ArticleStatus } from "@prisma/client";
import { calculateReadTime } from "@/shared/lib/read_time";
import { compileMarkdownToHtml } from "@/shared/lib/markdown";
import { saveArticleAction } from "@/features/articles/articles.actions";
import { FormIssue, parseErrorMessage } from "@/shared/lib/format_error";
import { DepartmentOption, InitialArticleData } from "./editor_types";

export function useArticleEditor(
  departments: DepartmentOption[],
  initialArticle?: InitialArticleData
) {
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
  const [documentType, setDocumentType] = useState<DocumentType>(
    initialArticle?.documentType ?? "STANDARD"
  );
  const [coverImageUrl, setCoverImageUrl] = useState(initialArticle?.coverImageUrl ?? "");
  const [revisionSummary, setRevisionSummary] = useState("");
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

  const { minutes, wordCount } = useMemo(() => calculateReadTime(content), [content]);
  const compiledHtml = useMemo(() => compileMarkdownToHtml(content), [content]);

  const clearFieldError = (field: string) => {
    setFeedback((prev) =>
      prev ? { ...prev, issues: prev.issues?.filter((i) => i.field !== field) } : null
    );
  };

  const handleSave = (targetStatus: ArticleStatus) => {
    setFeedback(null);

    if (content.length > 50000) {
      setFeedback({
        type: "error",
        title: "Content Limit Exceeded",
        message: "Article length exceeds maximum limit of 50,000 characters.",
        issues: [{ field: "content", message: "Content exceeds 50,000 characters" }],
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
          documentType,
          coverImageUrl: coverImageUrl || undefined,
          status: targetStatus,
          isPinned,
          revisionSummary: revisionSummary.trim() || undefined,
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
          message: `Documentation saved in ${targetStatus} state with changelog updated.`,
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

  return {
    state: {
      title,
      excerpt,
      content,
      departmentId,
      documentType,
      coverImageUrl,
      revisionSummary,
      isPinned,
      feedback,
      fieldErrors,
      isPending,
      minutes,
      wordCount,
      compiledHtml,
    },
    actions: {
      setTitle,
      setExcerpt,
      setContent,
      setDepartmentId,
      setDocumentType,
      setCoverImageUrl,
      setRevisionSummary,
      setIsPinned,
      setFeedback,
      clearFieldError,
      handleSave,
    },
  };
}
