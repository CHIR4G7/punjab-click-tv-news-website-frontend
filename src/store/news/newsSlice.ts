import { NewsState, Article, NewsResponse, createFeedKey } from "@/types/news";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createNewNewsDraft,
  editArticle,
  fetchNews,
  getArticle,
  getNewsForAdmin,
  publishArticle,
} from "./reducers";
import { NewsFormData } from "@/types/admin";
import { stat } from "fs";

const initialNewsState: NewsState = {
  articlesByID: {},
  feeds: {},
  editor: {
    draft: null,
    saving: false,
    success: false,
    error: null,
  },
  selectedArticle: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState: initialNewsState,
  reducers: {
    setSelectedArticle: (state, action: PayloadAction<Article | null>) => {
      state.selectedArticle = action.payload;
    },
    clearSelectedArticle: (state) => {
      state.selectedArticle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewNewsDraft.pending, (state) => {
        state.editor.saving = true;
        state.editor.success = false;
        state.editor.error = null;
      })
      .addCase(
        createNewNewsDraft.fulfilled as unknown as any,
        (state, action: PayloadAction<Article>) => {
          state.editor.saving = false;
          state.editor.success = true;
          state.editor.draft = action.payload;

          const adminKey = "public|all|all";

          state.feeds[adminKey].articleIDs.unshift(action.payload.data.id);
        },
      )
      .addCase(
        createNewNewsDraft.rejected as unknown as any,
        (state, action: PayloadAction<string>) => {
          state.editor.saving = false;
          state.editor.success = false;
          state.editor.error =
            (action.payload as string) || "Failed to Save Draft!";
        },
      )
      .addCase(fetchNews.pending, (state, action) => {
        const key = createFeedKey(action.meta.arg);
        if (!state.feeds[key] || action.meta.arg.reset) {
          state.feeds[key] = {
            articleIDs: [],
            cursor: null,
            hasMore: true,
            loading: true,
            error: null,
          };
        } else {
          state.feeds[key].loading = true;
        }
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        const feed = state.feeds[key];
        const articles = data.articles;
        articles.forEach((article) => {
          state.articlesByID[article.id] = article;
          // feed.articleIDs.push(article.id)
          if (!feed.articleIDs.includes(article.id)) {
            feed.articleIDs.push(article.id);
          }
        });
        console.log(feed.articleIDs[0]);
        feed.cursor = data.nextCursor;
        feed.hasMore = data.hasMore;
        feed.loading = false;
        feed.error = null;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        const key = createFeedKey(action.meta.arg);
        state.feeds[key].loading = false;
        state.feeds[key].error =
          (action.payload as string) || "Failed to fetch articles";
      })
      .addCase(publishArticle.pending, (state, action) => {
        state.editor.saving = true;
        state.editor.error = null;
      })
      .addCase(publishArticle.fulfilled, (state, action) => {
        const { message, data } = action.payload;
        console.log(data, message);
        state.editor.saving = false;
        state.articlesByID[data.id] = data as Article;
      })
      .addCase(getArticle.pending, (state, action) => {
        state.selectedArticle = null;
        state.editor.saving = true;
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        const { data, message } = action.payload;
        state.selectedArticle = data;
        state.editor.saving = false;
      })
      .addCase(getArticle.rejected, (state, action) => {
        state.selectedArticle = null;
        state.editor.saving = false;
      })
      .addCase(editArticle.pending, (state, action) => {
        state.editor.saving = true;
      })
      .addCase(editArticle.fulfilled, (state, action) => {
        ((state.editor.saving = false),
          (state.selectedArticle = action.payload.data));
      })
      .addCase(editArticle.rejected, (state, action) => {
        state.editor.saving = false;
      })
      .addCase(getNewsForAdmin.pending, (state, action) => {
        const key = createFeedKey(action.meta.arg);
        if (!state.feeds[key] || action.meta.arg.reset) {
          state.feeds[key] = {
            articleIDs: [],
            cursor: null,
            hasMore: true,
            loading: true,
            error: null,
          };
        } else {
          state.feeds[key].loading = true;
        }
      })
      .addCase(getNewsForAdmin.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        const feed = state.feeds[key];
        const articles = data.articles;
        articles.forEach((article) => {
          state.articlesByID[article.id] = article;
          // feed.articleIDs.push(article.id)
          if (!feed.articleIDs.includes(article.id)) {
            feed.articleIDs.push(article.id);
          }
        });
        console.log(feed.articleIDs[0]);
        feed.cursor = data.nextCursor;
        feed.hasMore = data.hasMore;
        feed.loading = false;
        feed.error = null;
      })
      .addCase(getNewsForAdmin.rejected, (state, action) => {
        const key = createFeedKey(action.meta.arg);
        state.feeds[key].loading = false;
        state.feeds[key].error =
          (action.payload as string) || "Failed to fetch articles";
      });
  },
});

export const { setSelectedArticle, clearSelectedArticle } = newsSlice.actions;
export default newsSlice.reducer;
