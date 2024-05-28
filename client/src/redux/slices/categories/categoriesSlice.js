import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction, resetSuccesAction } from "../globalSlice/globalSlice";

// Initial state
const INITIAL_STATE = {
    loading: false,
    error: null,
    categories: [],
    category: null,
    success: false,
};

//!Fetch public posts

export const fetchCategoriesAction = createAsyncThunk(
    "categories/lists",
    async (payload, { rejectWithValue,getState,dispatch }) => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/v1/categories");
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! Categories Slice
const CategoriesSlice = createSlice({
    name: "categories",
    initialState: INITIAL_STATE,
    
    extraReducers: (builder) => {
        // fetch public posts
        builder.addCase(fetchCategoriesAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            state.isLogin=true;
        });
        // handle rejected state
        builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
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
const categoriesReducer =CategoriesSlice.reducer;
export default categoriesReducer;
