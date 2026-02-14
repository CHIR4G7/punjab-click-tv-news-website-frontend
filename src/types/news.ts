import { NewsFormData } from "./admin";

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

export interface FeedState {
  articleIDs: string[];
  cursor: string | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

export interface EditorState {
  draft: Partial<NewsFormData> | Article | null;
  saving: boolean;
  success: boolean;
  error: string | null;
}

export interface NewsState {
  articlesByID: Record<string, Article>;
  feeds: Record<string, FeedState>;
  editor: EditorState;
  selectedArticle: Article | null; //selected for editing
}

export interface NewsResponse {
  articles: Article[];
  nextCursor: string;
  hasMore: boolean;
}

export interface FetchNewsPayload {
  category?: string | null;
  region?: string | null;
  mode: "public" | "drafted" | "published";
  reset?: boolean;
}
export function createFeedKey(payload: FetchNewsPayload) {
  return [
    payload.mode,
    payload.category || "all",
    payload.region || "all",
  ].join("|");
}
