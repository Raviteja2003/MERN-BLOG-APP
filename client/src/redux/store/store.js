import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/user/usersSlices";

//!store
const store = configureStore({
    reducer:{
        users:usersReducer,
    },
});

export default store;