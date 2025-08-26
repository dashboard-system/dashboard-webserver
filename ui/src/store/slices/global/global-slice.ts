import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { GlobalState, PageStatus } from '../../../libs/store/global'
import type { ThemeMode } from '../../../theme/NewDashboardTheme'

const initialPageStatus: PageStatus = {
  theme: 'dark',
  currentPage: 'landing',
  isSideBarExpand: false,
  isSideBarClosing: false,
  isLogin: false,
}

const initialState: GlobalState = {
  pageStatus: initialPageStatus,
  auth: { token: null },
  greetings: 'Hola',
  pageList: [
    { path: '/a429', label: 'ARINC 429', componentName: 'a429' },
    { path: '/lights', label: 'Lights', componentName: 'lights' },
    { path: '/ac', label: 'Air Conditioning', componentName: 'ac' },
    { path: '/bluetooth', label: 'Bluetooth', componentName: 'bluetooth' },
    { path: '/music', label: 'Music', componentName: 'music' },
    { path: '/settings', label: 'Settings', componentName: 'settings' },
  ],
}

const globalSlice = createSlice({
  // manage global state for the whole app
  name: 'global',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.pageStatus.theme = action.payload
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.auth.token = action.payload
    },
    setIsLogin(state, action: PayloadAction<boolean>) {
      state.pageStatus.isLogin = action.payload
    },
    updatePageStatus(state, action: PayloadAction<PageStatus>) {
      state.pageStatus = action.payload
    },
    setCurrentPage(state, action: PayloadAction<string>) {
      state.pageStatus.currentPage = action.payload
    },
    setIsSideBarExpand(state, action: PayloadAction<boolean>) {
      state.pageStatus.isSideBarExpand = action.payload
    },
    setGettings(state, action: PayloadAction<string>) {
      state.greetings = action.payload
    },
    resetUIStatus(state) {
      state.pageStatus = initialPageStatus
    },
  },
})

export const {
  setCurrentPage,
  updatePageStatus,
  setIsSideBarExpand,
  resetUIStatus,
  setGettings,
  setIsLogin,
  setToken,
  setTheme,
} = globalSlice.actions
export default globalSlice.reducer
