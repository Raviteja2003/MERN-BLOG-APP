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

//!Fetch private posts

export const fetchPrivatePostsAction = createAsyncThunk(
    "posts/fetch-private-posts",
    async (payload, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.get("http://localhost:5000/api/v1/posts",config);
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

//!Delete post

export const deletePostAction = createAsyncThunk(
    "posts/delete-post",
    async (postId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.delete(`http://localhost:5000/api/v1/posts/${postId}`,config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//!clap post

export const clapPostAction = createAsyncThunk(
    "posts/clap",
    async (postId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`http://localhost:5000/api/v1/posts/claps/${postId}`,{},config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);


//!like post

export const likePostAction = createAsyncThunk(
    "posts/like",
    async (postId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`http://localhost:5000/api/v1/posts/likes/${postId}`,{},config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//!dislike post

export const dislikePostAction = createAsyncThunk(
    "posts/dislike",
    async (postId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`http://localhost:5000/api/v1/posts/dislikes/${postId}`,{},config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//!post views count

export const postViewsCountAction = createAsyncThunk(
    "posts/post-views",
    async (postId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`http://localhost:5000/api/v1/posts/${postId}/post-view-count`,{},config);
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

//!update post
export const updatePostAction = createAsyncThunk(
    "posts/update",
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
            const { data } = await axios.put(`http://localhost:5000/api/v1/posts/${payload?.postId}`,formData,config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);


//! Posts Slice
const postSlice = createSlice({
    name: "posts",
    initialState: INITIAL_STATE,
    
    extraReducers: (builder) => {
        //! fetch public posts
        builder.addCase(fetchPublicPostsAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(fetchPublicPostsAction.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(fetchPublicPostsAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });
        //! fetch private posts
        builder.addCase(fetchPrivatePostsAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(fetchPrivatePostsAction.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(fetchPrivatePostsAction.rejected, (state, action) => {
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

        //! update post
        builder.addCase(updatePostAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(updatePostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(updatePostAction.rejected, (state, action) => {
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
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(getPostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //! like post
        builder.addCase(likePostAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(likePostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(likePostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //! dislike post
        builder.addCase(dislikePostAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(dislikePostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(dislikePostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });


        //!post views count
        builder.addCase(postViewsCountAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(postViewsCountAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(postViewsCountAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });


        //! clap post
        builder.addCase(clapPostAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(clapPostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(clapPostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //! delete post
        builder.addCase(deletePostAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(deletePostAction.fulfilled, (state, action) => {
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(deletePostAction.rejected, (state, action) => {
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
const postsReducer =postSlice.reducer;
export default postsReducer;
