import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import newsReducer from './news/newsSlice'

export const store = configureStore({
  reducer: {
    news:newsReducer,
  },
});

// 👉 Types (VERY IMPORTANT for TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
