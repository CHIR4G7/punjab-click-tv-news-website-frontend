import { makeApiRequest } from "@/lib/apis";
import { NewsFormData } from "@/types/admin";
import { Article, createFeedKey, FetchNewsPayload } from "@/types/news";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const createNewNewsDraft = createAsyncThunk(
  "news/create-draft",
  async (payload: NewsFormData, { rejectWithValue }) => {
    try {
      const response = await makeApiRequest(
        "/api/v1/news/create-draft",
        "POST",
        payload,
      );
      console.log("ye res", response);
      return response.data;
    } catch (err: any) {
      // // const err = error?.response?.data?.message
      // return rejectWithValue(error.message || "News Draft not created!")
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "News Draft not created!";

      return rejectWithValue(message);
    }
  },
);

export const fetchNews = createAsyncThunk<
  {
    key: string;
    data: {
      articles: Article[];
      nextCursor: string | null;
      hasMore: boolean;
    };
  },
  FetchNewsPayload,
  { state: RootState; rejectValue: string }
>("/news/fetch", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const key = createFeedKey(payload);

    const feed = state.news.feeds[key];
    const cursor = payload.reset ? null : feed?.cursor;

    const params = new URLSearchParams();

    if (payload.category) params.append("category", payload.category);
    if (payload.region) params.append("region", payload.region);
    if (cursor) params.append("cursor", cursor);
    params.append("limit", "10");

    const url = `/api/v1/news/get-news?${params.toString()}`;
    const response = (await makeApiRequest(url, "GET")) as {
      data: {
        data: {
          articles: Article[];
          nextCursor: string | null;
          hasMore: boolean;
        };
      };
    };

    return {
      key,
      data: response.data.data,
    };
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to fetch news";

    return rejectWithValue(message);
  }
});

export const publishArticle = createAsyncThunk(
  "news/publish-article",
  async ({ id }: { id: string }, { getState, rejectWithValue }) => {
    try {
      const response = await makeApiRequest('/api/v1/news/publish-article',"PUT",{id:id})
      return response.data
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to fetch news";

      return rejectWithValue(message);
    }
  },
);
