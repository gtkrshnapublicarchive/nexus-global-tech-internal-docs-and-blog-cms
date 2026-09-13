import { z } from "zod";

export const ArticleStatusEnum = z.enum([
  "DRAFT",
  "IN_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
]);

export const DocumentTypeEnum = z.enum([
  "RFC",
  "ADR",
  "POST_MORTEM",
  "RUNBOOK",
  "ONBOARDING",
  "STANDARD",
]);

export const CreateArticleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(180, "Title must be under 180 characters"),
  excerpt: z
    .string()
    .min(5, "Excerpt summary must be at least 5 characters")
    .max(300, "Excerpt summary must be under 300 characters"),
  content: z
    .string()
    .min(1, "Markdown content cannot be empty")
    .max(50000, "Content cannot exceed 50,000 characters"),
  departmentId: z.string().min(1, "Department must be selected"),
  documentType: DocumentTypeEnum.default("STANDARD"),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: ArticleStatusEnum.default("DRAFT"),
  isPinned: z.boolean().default(false),
  revisionSummary: z.string().max(300).optional(),
});

export const UpdateArticleSchema = CreateArticleSchema.partial().extend({
  id: z.string().min(1, "Article ID is required"),
  revisionSummary: z.string().max(300).optional(),
});

export type CreateArticleDto = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleDto = z.infer<typeof UpdateArticleSchema>;
export type DocumentType = z.infer<typeof DocumentTypeEnum>;
