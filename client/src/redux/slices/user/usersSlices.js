import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction, resetSuccesAction } from "../globalSlice/globalSlice";

// Initial state
const INITIAL_STATE = {
    loading: false,
    error: null,
    users: [],
    user: null,
    success: false,
    isUpdated: false,
    isEmailSent: false,
    isPasswordReset: false,
    isRegistered: false,
    isLogin: false,
    profile: {},
    isVerified: false,
    userAuth: {
        error: null,
        userInfo: localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))
            : null,
    },
};

//! Register Action
export const registerAction = createAsyncThunk(
    "users/register",
    async (payload, { rejectWithValue,getState,dispatch }) => {
        try {
            const { data } = await axios.post("http://localhost:5000/api/v1/users/register", payload);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);


//! Get user public profile Action
export const userPublicProfileAction = createAsyncThunk(
    "users/user-public-profile",
    async (userId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.get(`http://localhost:5000/api/v1/users/public-profile/${userId}`,config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! Get user profile Action
export const userPrivateProfileAction = createAsyncThunk(
    "users/user-private-profile",
    async (userId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.get(`http://localhost:5000/api/v1/users/profile/`,config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! blocking user Action
export const blockUserAction = createAsyncThunk(
    "users/block-user",
    async (userId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`http://localhost:5000/api/v1/users/block/${userId}`,{},config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! unblocking user Action
export const unblockUserAction = createAsyncThunk(
    "users/unblock-user",
    async (userId, { rejectWithValue,getState,dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`http://localhost:5000/api/v1/users/unblock/${userId}`,{},config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! Login Action
export const loginAction = createAsyncThunk(
    "users/login",
    async (payload, { rejectWithValue,getState,dispatch }) => {
        try {
            const { data } = await axios.post("http://localhost:5000/api/v1/users/login", payload);
            localStorage.setItem("userInfo", JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

// ! Logout action
export const logoutAction = createAsyncThunk("users/logout", async () => {
    //remove token from localstorage
    localStorage.removeItem("userInfo");
    return true;
  });


//! Users Slice
const usersSlice = createSlice({
    name: "users",
    initialState: INITIAL_STATE,
    
    extraReducers: (builder) => {
        //! login pending
        builder.addCase(loginAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(loginAction.fulfilled, (state, action) => {
            state.userAuth.userInfo = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            state.isLogin=true;
        });
        // handle rejected state
        builder.addCase(loginAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //!user public profile
        builder.addCase(userPublicProfileAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(userPublicProfileAction.fulfilled, (state, action) => {
            state.user = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(userPublicProfileAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //!user private profile
        builder.addCase(userPrivateProfileAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(userPrivateProfileAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(userPrivateProfileAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //!block user
        builder.addCase(blockUserAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(blockUserAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(blockUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //!unblock user
        builder.addCase(unblockUserAction.pending, (state,action) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(unblockUserAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
            
        });
        // handle rejected state
        builder.addCase(unblockUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //!Register
        builder.addCase(registerAction.pending, (state) => {
            state.loading = true;
             
        });
        // handle fulfilled case
        builder.addCase(registerAction.fulfilled, (state, action) => {
            state.user = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        // handle rejected state
        builder.addCase(registerAction.rejected, (state, action) => {
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
const usersReducer = usersSlice.reducer;
export default usersReducer;
