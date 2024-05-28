import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction, resetSuccesAction } from "../globalSlice/globalSlice";

// Initial state
const INITIAL_STATE = {
    loading: false,
    error: null,
    posts: [],
    post: null,
    success: false,
};

//!Fetch public posts

export const fetchPublicPostsAction = createAsyncThunk(
    "posts/fetch-public-posts",
    async (payload, { rejectWithValue,getState,dispatch }) => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/v1/posts/public");
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);
//!Fetch single post

export const getPostAction = createAsyncThunk(
    "posts/get-post",
    async (postId, { rejectWithValue,getState,dispatch }) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/v1/posts/${postId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//!create post
export const addPostAction = createAsyncThunk(
    "posts/create",
    async (payload, { rejectWithValue,getState,dispatch }) => {
        
        try {
            //convert payload to fromdata
            const formData = new FormData();
            formData.append("title",payload?.title);
            formData.append("content",payload?.content);
            formData.append("categoryId",payload?.category);
            formData.append("file",payload?.image);
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.post("http://localhost:5000/api/v1/posts",formData,config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);


//! Posts Slice
const PublicPostsSlice = createSlice({
    name: "posts",
    initialState: INITIAL_STATE,
    
    extraReducers: (builder) => {
        // fetch public posts
        builder.addCase(fetchPublicPostsAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(fetchPublicPostsAction.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(fetchPublicPostsAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //! create post
        builder.addCase(addPostAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(addPostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(addPostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });
        
        //! get single post
        builder.addCase(getPostAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(getPostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(getPostAction.rejected, (state, action) => {
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
const postsReducer =PublicPostsSlice.reducer;
export default postsReducer;
