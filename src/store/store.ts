import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./messageSlice";
import loadingSlice from './loadingSlice';

const store = configureStore({
  reducer: {
    infoMessage: messageSlice,
    loading: loadingSlice,
  },
});

export default store;
