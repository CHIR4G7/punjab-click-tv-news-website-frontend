import { NewsState, Article } from "@/types/news";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createNewNewsDraft } from "./reducers";


const initialNewsState: NewsState = {
  articles: [],
  selectedArticle: null,
  
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalArticles: 0,
    limit: 20,
  },
  
  filters: {
    category: null,
    region: null,
    language: null,
    status: 'all',
    searchQuery: '',
  },
  
  loading: {
    fetchArticles: false,
    createArticle: false,
    updateArticle: false,
    deleteArticle: false,
  },
  
  error: {
    fetchArticles: null,
    createArticle: null,
    updateArticle: null,
    deleteArticle: null,
  },
};

const newsSlice = createSlice({
    name:"auth",
    initialState:initialNewsState,
    reducers:{
       
    },
    extraReducers:builder=>{
        builder.addCase(createNewNewsDraft.pending,state=>{
            state.loading.createArticle = true;
        }).addCase((createNewNewsDraft.fulfilled as unknown as any),(state, action: PayloadAction<Article[]>)=>{
            state.loading.createArticle = false;
            state.articles = action.payload;
        }).addCase((createNewNewsDraft.rejected as unknown as any),(state,action:PayloadAction<string>)=>{
            state.loading.createArticle = false;
            state.error.createArticle = action.payload
        })
    }
})

// export const { logout } = authSlice.actions;
export default newsSlice.reducer;