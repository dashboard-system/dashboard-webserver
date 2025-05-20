// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageStatus {
  currentPage: string;
  isSideBarExpand: boolean;
  isLogin: boolean;
}
interface GlobalState {
  pageStatus: PageStatus;
}

const initialPageStatus: PageStatus = {
  currentPage: "landing",
  isSideBarExpand: false,
  isLogin: false,
};

const initialState: GlobalState = {
  pageStatus: initialPageStatus,
};

const globalSlice = createSlice({
  // manage global state for the whole app
  name: "global",
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<string>) {
      state.pageStatus.currentPage = action.payload;
    },
    setIsSideBarExpand(state, action: PayloadAction<boolean>) {
      state.pageStatus.isSideBarExpand = action.payload;
    },
    resetUIStatus(state) {
      state.pageStatus = initialPageStatus;
    },
  },
});

export const { setCurrentPage, setIsSideBarExpand, resetUIStatus } =
  globalSlice.actions;
export default globalSlice.reducer;
