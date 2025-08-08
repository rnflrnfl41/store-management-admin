import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./messageSlice";
import loadingSlice from "./loadingSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    message: messageSlice,
    loading: loadingSlice,
  },
});

export default store;
