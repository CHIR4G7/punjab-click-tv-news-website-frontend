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

    if (payload.mode == "public") {
      params.append("published", "true");
    }

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
      console.log(id);
      const response = (await makeApiRequest(
        "/api/v1/news/publish-article",
        "PUT",
        { id: id },
      )) as {
        data: {
          message: string;
          data: Article;
        };
      };
      console.log(response.data);
      return {
        message: response.data.message,
        data: response.data.data,
      };
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to fetch news";
      return rejectWithValue(message);
    }
  },
);

export const getArticle = createAsyncThunk(
  "news/getArticle",
  async ({ id }: { id: string }, { rejectWithValue, getState }) => {
    try {
      const params = new URLSearchParams();
      if (id) {
        params.append("id", id);
      }
      const url = `/api/v1/news/article?${params.toString()}`;
      const response = (await makeApiRequest(url, "GET")) as {
        data: {
          message: string;
          success: boolean;
          data: Article;
        };
      };
      //return the article
      return {
        data: response.data.data,
        message: response.data.message,
      };
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to fetch news";

      return rejectWithValue(message);
    }
  },
);

export const editArticle = createAsyncThunk(
  "news/edit-article",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const response = (await makeApiRequest(
        "/api/v1/news/edit-article",
        "PUT",
        { data: payload },
      )) as {
        data: {
          message: string;
          data: Article;
          success: boolean;
        };
      };

      return {
        data: response.data.data,
        message: response.data.message,
      };
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to fetch news";

      return rejectWithValue(message);
    }
  },
);

export const getNewsForAdmin = createAsyncThunk(
  "news/admin-news",
  async (payload: FetchNewsPayload, { rejectWithValue, getState }) => {
    try {
      const params = new URLSearchParams();
      const state = getState();
      const keyAdmin = createFeedKey(payload);

      const feed = state.news.feeds[keyAdmin];
      const cursor = payload.reset ? null : feed?.cursor;
      if (cursor) params.append("cursor", cursor);
      params.append("limit", "10");

      if (payload.mode == "published") {
        params.append("mode", "published");
      } else {
        params.append("mode", "drafted");
      }

      const url = `/api/v1/news/admin-news?${params.toString()}`;
      const response = (await makeApiRequest(url, "GET")) as {
        data: {
          data: {
            articles: Article[];
            hasMore: boolean;
            nextCursor: string;
          };
        };
      };

      let key = null;

      if (payload.mode == "drafted") {
        key = createFeedKey({
          mode: "drafted",
          category: "",
          region: "",
        });
      } else {
        key = createFeedKey({
          mode: "published",
          category: "",
          region: "",
        });
      }

      return {
        key,
        data: response.data.data,
      };
    } catch (error) {}
  },
);
