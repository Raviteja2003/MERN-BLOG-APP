import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/user/usersSlices";
import postsReducer from "../slices/post/postsSlice";
import categoriesReducer from "../slices/categories/categoriesSlice";
import commentsReducer from "../slices/comments/commentsSlice";

//!store
const store = configureStore({
    reducer:{
        users:usersReducer,
        posts:postsReducer,
        categories:categoriesReducer,
        comments:commentsReducer,
    },
});

export default store;