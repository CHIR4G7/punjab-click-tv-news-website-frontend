// src/store/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "./reducers";
import { isAuthenticated, getUserFromToken, removeAuthToken } from "../../lib/utils";

type AuthState = {
    user: any | null,
    loading: boolean,
    error: string | null
}

// Initialize state by checking for existing token
const initializeAuthState = (): AuthState => {
    if (isAuthenticated()) {
        const user = getUserFromToken();
        return {
            user,
            loading: false,
            error: null
        };
    }
    
    return {
        user: null,
        loading: false,
        error: null
    };
};

const initialState: AuthState = initializeAuthState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.loading = false;
            state.error = null;
            removeAuthToken(); // Clear cookies
        },
        checkAuth(state) {
            // Manual auth check
            if (isAuthenticated()) {
                state.user = getUserFromToken();
                state.error = null;
            } else {
                state.user = null;
                removeAuthToken();
            }
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // Extract user from the login response
                state.user = action.payload.user;
                state.loading = false;
                state.error = null;
                console.log('Auth slice: User set to:', state.user);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload as string;
                console.log('Auth slice: Login rejected:', action.payload);
            });
    }
});

export const { logout, checkAuth, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;