"use client";

import { FeedbackAlert } from "@/shared/ui/feedback_alert";
import { StudioHeader } from "./studio_header";
import { StudioMetadataForm } from "./studio_metadata_form";
import { StudioPanes } from "./studio_panes";
import { useArticleEditor } from "./use_article_editor";
import { DepartmentOption, InitialArticleData } from "./editor_types";

interface MarkdownStudioProps {
  departments: DepartmentOption[];
  initialArticle?: InitialArticleData;
}

export function MarkdownStudio({ departments, initialArticle }: MarkdownStudioProps) {
  const { state, actions } = useArticleEditor(departments, initialArticle);

  return (
    <div className="space-y-6">
      <StudioHeader
        isEditing={!!initialArticle}
        isPending={state.isPending}
        minutes={state.minutes}
        wordCount={state.wordCount}
        contentLength={state.content.length}
        onSave={actions.handleSave}
      />

      {state.feedback && (
        <FeedbackAlert
          type={state.feedback.type}
          title={state.feedback.title}
          message={state.feedback.message}
          issues={state.feedback.issues}
          onDismiss={() => actions.setFeedback(null)}
        />
      )}

      <StudioMetadataForm
        title={state.title}
        setTitle={actions.setTitle}
        departmentId={state.departmentId}
        setDepartmentId={actions.setDepartmentId}
        documentType={state.documentType}
        setDocumentType={actions.setDocumentType}
        excerpt={state.excerpt}
        setExcerpt={actions.setExcerpt}
        coverImageUrl={state.coverImageUrl}
        setCoverImageUrl={actions.setCoverImageUrl}
        revisionSummary={state.revisionSummary}
        setRevisionSummary={actions.setRevisionSummary}
        isPinned={state.isPinned}
        setIsPinned={actions.setIsPinned}
        fieldErrors={state.fieldErrors}
        clearFieldError={actions.clearFieldError}
        departments={departments}
      />

      <StudioPanes
        content={state.content}
        setContent={actions.setContent}
        compiledHtml={state.compiledHtml}
        contentError={state.fieldErrors.content}
        clearContentError={() => actions.clearFieldError("content")}
      />
    </div>
  );
}
