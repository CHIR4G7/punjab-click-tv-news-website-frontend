import { NewsFormData } from "./admin";

export interface Article {
  _id: string;
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

export interface FeedState{
  articles:Article[],
  cursor:string,
  hasMore:boolean,
  loading:boolean,
  error:string|null
}

export interface EditorState{
  draft:Partial<NewsFormData> | null
  saving:boolean,
  succcess:boolean,
  error:string | null
}

export interface NewsState{
  feeds:Record<string,FeedState>
  editor:EditorState,
  selectedArticle:Article | null //selected for editing
}
 

export interface NewsResponse{
  articles:Article[],
  nextCursor:string,
  hasMore:boolean
}

export interface FetchNewsPayload{
  category?:string | null;
  region?:string | null;
  mode: "public",
  reset?:boolean
}
export function createFeedKey(payload: FetchNewsPayload) {
  return [
    payload.mode,
    payload.category || "all",
    payload.region || "all",
  ].join("|");
}