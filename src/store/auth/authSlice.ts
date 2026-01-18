import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "./reducers";

type AuthState = {
    user:any|null,
    loading:boolean
}

const initialState:AuthState = {
    user:null,
    loading:true
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout(state){
            state.user = null
        }
    },
    extraReducers:builder=>{
        builder.addCase(loginUser.pending,state=>{
            state.loading = true
        }).addCase(loginUser.fulfilled,(state,action)=>{
            state.user = action.payload;
            state.loading = false;
        }).addCase(loginUser.rejected,state=>{
            state.loading = false;
            state.user = null;
        })
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;