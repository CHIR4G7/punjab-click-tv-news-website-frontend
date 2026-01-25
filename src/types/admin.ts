export interface NewsArticle {
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


export interface NewsFormData {
  title: string;
  content: string;
  category: string;
  imageUrls: File[];
  summary: string;
  region: string;
  coverPageImg: File | null;
}