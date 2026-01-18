export interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  category?: string;
  imageUrls?: string[];
  summary: string;
  region: string;
  coverPageImg: string | null;
  language:string;
  source:string;
  isPublished:boolean;
  isDrafted:boolean;
  createdAt:string;
  publishedAt:string;
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