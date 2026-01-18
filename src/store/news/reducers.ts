import { makeApiRequest } from "@/lib/apis";
import { NewsFormData } from "@/types/admin";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createNewNewsDraft = createAsyncThunk(
    'news/create-draft',
    async (payload:NewsFormData,{rejectWithValue})=>{
        try {
            const response = await makeApiRequest('/api/v1/news/create-draft','POST',payload)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "News not found!")
        }
    }
)