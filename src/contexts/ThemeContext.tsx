import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { dashboardTheme, dashboardLightTheme } from '../theme/NewDashboardTheme'
import { theme as legacyDashboardTheme } from '../theme/DashboardTheme'
import { useAppSelector } from '../store/hook'
import type { ThemeMode } from '../theme/NewDashboardTheme'

interface ThemeContextType {
  currentMode: 'light' | 'dark'
  themeMode: ThemeMode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function CustomThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useAppSelector((state) => state.global.pageStatus.theme)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // Determine the actual theme mode based on user setting and system preference
  const actualMode = useMemo(() => {
    if (themeMode === 'system') {
      return prefersDarkMode ? 'dark' : 'light'
    }
    return themeMode === 'dark' ? 'dark' : 'light'
  }, [themeMode, prefersDarkMode])

  // Select the appropriate theme based on the actual mode
  const selectedTheme = useMemo(() => {
    if (actualMode === 'dark') {
      // Use dashboard theme for dark mode
      return dashboardTheme
    } else {
      // Use dashboard light theme for light mode
      return dashboardLightTheme
    }
  }, [actualMode])

  // Update body background color when theme changes
  useEffect(() => {
    const backgroundColor = actualMode === 'dark' ? '#000000' : '#FFFFFF'
    document.body.style.backgroundColor = backgroundColor
    
    // Also update the meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.setAttribute('content', backgroundColor)
  }, [actualMode])

  const contextValue = useMemo((): ThemeContextType => ({
    currentMode: actualMode as 'light' | 'dark',
    themeMode: themeMode,
  }), [actualMode, themeMode])

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={selectedTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}