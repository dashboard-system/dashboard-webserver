import { createContext, type ReactNode } from 'react'
import { useColorScheme } from '@mui/material/styles'

type PageContextType = {
  placeholder: string
}

const PageContext = createContext<PageContextType | null>(null)

const PageContextProvider = ({ children }: { children: ReactNode }) => {
  const { mode, setMode } = useColorScheme()
  const placeholder = '123'
  return (
    <PageContext.Provider value={{ placeholder }}>
      {children}
    </PageContext.Provider>
  )
}

export { PageContext, PageContextProvider }
