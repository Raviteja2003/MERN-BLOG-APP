import { createAsyncThunk } from "@reduxjs/toolkit";

//!Reset success Action
export const resetSuccesAction = createAsyncThunk(
    "reset-success-action",
    () => {
      return true;
    }
  );
  
  //! Reset error action
  export const resetErrorAction = createAsyncThunk("reset-error-action", () => {
    return true;
  });