import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "./reducers";
import { isAuthenticated, getUserFromToken, removeAuthToken } from "../../lib/utils";

type AuthState = {
    user: any | null,
    loading: boolean
}

// Initialize state by checking for existing token
const initializeAuthState = (): AuthState => {
    if (isAuthenticated()) {
        const user = getUserFromToken();
        return {
            user,
            loading: false
        };
    }
    
    return {
        user: null,
        loading: false
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
            removeAuthToken(); // Clear cookies
        },
        checkAuth(state) {
            // Manual auth check
            if (isAuthenticated()) {
                state.user = getUserFromToken();
            } else {
                state.user = null;
                removeAuthToken();
            }
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, state => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // Extract user from the login response
                state.user = action.payload.data?.user || action.payload.user || action.payload;
                state.loading = false;
            })
            .addCase(loginUser.rejected, state => {
                state.loading = false;
                state.user = null;
            });
    }
})

export const { logout, checkAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;