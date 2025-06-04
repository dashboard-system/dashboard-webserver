import type { ThemeMode } from '../../theme/DashboardTheme'

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

type PageList = PageItem[]

interface GlobalState {
  pageStatus: PageStatus
  greetings: string
  pageList: PageList
}

export type { PageStatus, GlobalState, PageItem }
