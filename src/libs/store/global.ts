import type { ThemeMode } from '../../theme/DashboardTheme'

interface PageStatus {
  theme: ThemeMode
  currentPage: string
  isSideBarExpand: boolean
  setIsSideBarClosing: boolean
  isLogin: boolean
}

interface GlobalState {
  pageStatus: PageStatus
  gettings: string
}

export type { PageStatus, GlobalState }
