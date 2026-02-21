// src/store/auth/reducers.ts
import { makeApiRequest } from "@/lib/apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({username, password}: {username: string, password: string}, {rejectWithValue}) => {
        try {
            const response = await makeApiRequest('/api/v1/verify/login', 'POST', {username, password});
            
            // The response should contain user data and potentially set cookies
            console.log('Login response:', response);
            
            // Return the user data
            return {
                user: response.data.user || response.data,
                token: response.data.token,
                message: response.data.message
            }
        } catch (error: any) {
            console.error('Login error in reducer:', error);
            return rejectWithValue(error?.response?.data?.message || error.message || "Login failed");
        }
    }
);