import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./messageSlice";

const store = configureStore({
  reducer: {
    infoMessage: messageSlice,
  },
});

export default store;
