import { ArticleStatus, DocumentType } from "@prisma/client";

export interface DepartmentOption {
  id: string;
  name: string;
}

export interface InitialArticleData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  departmentId: string;
  documentType: DocumentType;
  coverImageUrl?: string | null;
  isPinned: boolean;
  status: ArticleStatus;
}

export const DOCUMENT_TYPE_SELECT_OPTIONS = [
  { value: "RFC", label: "RFC - Request for Comments (150 AUR)" },
  { value: "ADR", label: "ADR - Architecture Decision (150 AUR)" },
  { value: "POST_MORTEM", label: "Post-Mortem - Incident Report (200 AUR)" },
  { value: "RUNBOOK", label: "Runbook - Ops & Recovery (120 AUR)" },
  { value: "ONBOARDING", label: "Onboarding - Team Guide (100 AUR)" },
  { value: "STANDARD", label: "Standard - Engineering Guideline (50 AUR)" },
];
