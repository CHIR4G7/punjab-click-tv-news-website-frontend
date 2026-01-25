import { NewsState, Article, NewsResponse, createFeedKey } from "@/types/news";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createNewNewsDraft, fetchNews } from "./reducers";
import { NewsFormData } from "@/types/admin";

const initialNewsState: NewsState = {
  feeds: {},
  editor: {
    draft: null,
    saving: false,
    succcess: false,
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
    },},
  extraReducers: (builder) => {
    builder
      .addCase(createNewNewsDraft.pending, (state) => {
        state.editor.saving = true;
        state.editor.succcess = false;
        state.editor.error = null;
      })
      .addCase(
        createNewNewsDraft.fulfilled as unknown as any,
        (state, action: PayloadAction<NewsFormData>) => {
          state.editor.saving = false;
          state.editor.succcess = true;
          state.editor.draft = action.payload;
        },
      )
      .addCase(
        createNewNewsDraft.rejected as unknown as any,
        (state, action: PayloadAction<string>) => {
          state.editor.saving = false;
          state.editor.succcess = false;
          state.editor.error =
            (action.payload as string) || "Failed to Save Draft!";
        },
      )
      .addCase(fetchNews.pending, (state, action) => {
        const key = createFeedKey(action.meta.arg);
        if (!state.feeds[key] || action.meta.arg.reset) {
          state.feeds[key] = {
            articles: [],
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
        feed.articles.push(...data.articles);
        feed.cursor = data.nextCursor;
        feed.hasMore = data.hasMore;
        feed.loading = false;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        const key = createFeedKey(action.meta.arg);

        state.feeds[key].loading = false;
        state.feeds[key].error =
          (action.payload as string) || "Failed to fetch articles";
      });
  },
});

export const { setSelectedArticle,clearSelectedArticle } = newsSlice.actions;
export default newsSlice.reducer;
