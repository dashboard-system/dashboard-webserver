import type { ThemeMode } from '../../theme/NewDashboardTheme'

interface PageStatus {
  theme: ThemeMode
  currentPage: string
  isSideBarExpand: boolean
  isSideBarClosing: boolean
  isLogin: boolean
}

interface PageItem {
  path: string
  label: string
  componentName: string
}

interface AuthStatus {
  token: string | null
}

type PageList = PageItem[]

interface GlobalState {
  pageStatus: PageStatus
  greetings: string
  pageList: PageList
  auth: AuthStatus
}

export type { PageStatus, GlobalState, PageItem }
