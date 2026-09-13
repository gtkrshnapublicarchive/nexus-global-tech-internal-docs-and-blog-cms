export interface FeedArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  department: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    department: string;
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
