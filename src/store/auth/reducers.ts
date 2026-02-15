import { makeApiRequest } from "@/lib/apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({username, password}: {username: string, password: string}, {rejectWithValue}) => {
        try {
            const response = await makeApiRequest('/api/v1/verify/login', 'POST', {username, password})
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Login failed")
        }
    }
)