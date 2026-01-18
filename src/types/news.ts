export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  region: string;
  coverPageImg: string | null;
  imageUrls: string[];
  language: string;
  source: string;
  isPublished: boolean;
  isDrafted: boolean;
  publishedAt: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface NewsState {
  articles: Article[];
  selectedArticle: Article | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalArticles: number;
    limit: number;
  };
  filters: {
    category: string | null;
    region: string | null;
    language: string | null;
    status: "published" | "draft" | "all";
    searchQuery: string;
  };
  loading: {
    fetchArticles: boolean;
    createArticle: boolean;
    updateArticle: boolean;
    deleteArticle: boolean;
  };
  error: {
    fetchArticles: string | null;
    createArticle: string | null;
    updateArticle: string | null;
    deleteArticle: string | null;
  };
}
