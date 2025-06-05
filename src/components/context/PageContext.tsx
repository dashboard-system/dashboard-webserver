import { createContext, type ReactNode } from 'react'
import { useColorScheme } from '@mui/material/styles'
import { useAppSelector } from '../../store/hook'

export type PageContextType = {
  isLogin: boolean
}

const PageContext = createContext<PageContextType | null>(null)

const PageContextProvider = ({ children }: { children: ReactNode }) => {
  const { mode, setMode } = useColorScheme()
  const isLogin = useAppSelector((state) => state.global.pageStatus.isLogin)

  return (
    <PageContext.Provider value={{ isLogin }}>{children}</PageContext.Provider>
  )
}

export { PageContext, PageContextProvider }
