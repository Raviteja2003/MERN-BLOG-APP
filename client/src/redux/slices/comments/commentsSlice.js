import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction, resetSuccesAction } from "../globalSlice/globalSlice";


// Initial state
const INITIAL_STATE = {
    loading: false,
    error: null,
    comments: [],
    comment: null,
    success: false,
};

//!create comment
export const createCommentAction = createAsyncThunk(
    "comment/create",
    async (payload, { rejectWithValue,getState,dispatch }) => {
        
        try {
            
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`http://localhost:5000/api/v1/comments/${payload?.postId}`,
                {
                    message : payload?.message,
                },config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! comments Slice
const postSlice = createSlice({
    name: "posts",
    initialState: INITIAL_STATE,
    
    extraReducers: (builder) => {
        //! create comment
        builder.addCase(createCommentAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(createCommentAction.fulfilled, (state, action) => {
            state.comment = action.payload;
            state.loading = false;
            state.error = null;
            state.success=true;
            
        });
        // handle rejected state
        builder.addCase(createCommentAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //!Reset error action
        builder.addCase(resetErrorAction.fulfilled,(state)=>{
            state.error=null;
        })
        //!Resert success action
        builder.addCase(resetSuccesAction.fulfilled,(state)=>{
            state.success=false;
        })
    },
});

// Generate the reducer
const commentsReducer =postSlice.reducer;
export default commentsReducer;

