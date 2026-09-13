export interface FeedArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  documentType: "RFC" | "ADR" | "POST_MORTEM" | "RUNBOOK" | "ONBOARDING" | "STANDARD";
  aurumBounty: number;
  lastVerifiedAt: string | null;
  verifiedBy: string | null;
  department: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    department: string;
    aurumBalance?: number;
  };
  isPinned: boolean;
  readTimeMinutes: number;
  wordCount: number;
  publishedAt: string | null;
  isBookmarked: boolean;
}

export interface DepartmentFilterItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface AuthorBountyLeaderboardItem {
  id: string;
  name: string;
  department: string;
  aurumBalance: number;
  articleCount: number;
}
