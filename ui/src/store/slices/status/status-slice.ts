import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StatusState {
  [topic: string]: any;
}

const initialState: StatusState = {};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    addStatusTopic(state, action: PayloadAction<{ topic: string; message: any }>) {
      const { payload } = action;
      state[payload.topic] = payload.message;
    },
    removeStatusTopic(state, action: PayloadAction<{ topic: string }>) {
      const { payload } = action;
      delete state[payload.topic];
    },
  },
});

export const { addStatusTopic, removeStatusTopic } = statusSlice.actions;
export default statusSlice.reducer;