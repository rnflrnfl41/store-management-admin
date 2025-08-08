import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  message: string | null;
  type: "info" | "error" | "success" | null;
}

// 2. 초기 state
const initialState: MessageState = {
  message: null,
  type: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<{ message: string; type: "info" | "error" | "success" }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearMessage: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;