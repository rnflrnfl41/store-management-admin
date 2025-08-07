import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  message: string;
  type: "info" | "error" | "success";
}

// 2. 초기 state
const initialState: MessageState = {
  message: "",
  type: "info",
};

const messageSlice = createSlice({
  name: "infoMessage",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<Partial<MessageState>>) => {
      state.message = action.payload.message ?? "";
      state.type = action.payload.type || "info";
    },
    clearMessage: (state) => {
      state.message = "";
      state.type = "info";
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;