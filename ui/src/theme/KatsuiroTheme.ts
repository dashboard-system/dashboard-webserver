import { createTheme, ThemeOptions } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
import React from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'

// Traditional Japanese Katsu-iro color palette
const katsuiroColors = {
  // Katsu-iro (Victory color) - Primary tones
  main: '#181B39',
  light: '#2C3456',
  dark: '#0F1126',
  
  // Related traditional Japanese colors
  complementary: {
    // Yamabuki-iro (Golden yellow) - Complementary to Katsu-iro
    yamabuki: '#F8B500',
    yamabukiLight: '#FFD54F',
    yamabukiDark: '#E68900',
    
    // Sakura-iro (Cherry blossom pink) - Soft contrast color
    sakura: '#FFB7C5',
    sakuraLight: '#FFCCCB',
    sakuraDark: '#FF91A4',
    
    // Wakatake-iro (Young bamboo green)
    wakatake: '#68BE8D',
    wakatakeLight: '#81C784',
    wakatakeDark: '#4CAF50',
  },
  
  // Neutral tones
  neutral: {
    gofun: '#FFFFFB',    // Japanese white
    shinju: '#F8F4E6',   // Pearl color
    nezumi: '#949495',   // Mouse gray
    sumi: '#1C1C1C',     // Ink black
  }
}

// Create light theme
const createLightTheme = (): ThemeOptions => ({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      light: katsuiroColors.light,
      main: katsuiroColors.main,
      dark: katsuiroColors.dark,
      contrastText: katsuiroColors.neutral.gofun,
    },
    secondary: {
      light: katsuiroColors.complementary.yamabukiLight,
      main: katsuiroColors.complementary.yamabuki,
      dark: katsuiroColors.complementary.yamabukiDark,
      contrastText: katsuiroColors.main,
    },
    error: {
      light: '#ffcdd2',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    warning: {
      light: katsuiroColors.complementary.yamabukiLight,
      main: katsuiroColors.complementary.yamabuki,
      dark: katsuiroColors.complementary.yamabukiDark,
      contrastText: katsuiroColors.main,
    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    success: {
      light: katsuiroColors.complementary.wakatakeLight,
      main: katsuiroColors.complementary.wakatake,
      dark: katsuiroColors.complementary.wakatakeDark,
      contrastText: '#fff',
    },
    background: {
      default: katsuiroColors.neutral.gofun,
      paper: katsuiroColors.neutral.shinju,
    },
    text: {
      primary: katsuiroColors.main,
      secondary: katsuiroColors.neutral.nezumi,
    },
  },
})

// Create dark theme
const createDarkTheme = (): ThemeOptions => ({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      light: '#4A5A7A',
      main: '#6C7B95',
      dark: katsuiroColors.main,
      contrastText: katsuiroColors.neutral.gofun,
    },
    secondary: {
      light: katsuiroColors.complementary.yamabukiLight,
      main: katsuiroColors.complementary.yamabuki,
      dark: katsuiroColors.complementary.yamabukiDark,
      contrastText: katsuiroColors.main,
    },
    background: {
      default: katsuiroColors.dark,
      paper: katsuiroColors.main,
    },
    text: {
      primary: katsuiroColors.neutral.gofun,
      secondary: '#B0BEC5',
    },
  },
})

// Common component styles configuration
const commonComponents = {
  // Button component
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none' as const,
        fontWeight: 600,
        padding: '8px 24px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(24, 27, 57, 0.15)',
        },
      },
      containedPrimary: {
        background: `linear-gradient(45deg, ${katsuiroColors.main} 30%, ${katsuiroColors.light} 90%)`,
        '&:hover': {
          background: `linear-gradient(45deg, ${katsuiroColors.dark} 30%, ${katsuiroColors.main} 90%)`,
        },
      },
    },
  },
  
  // Icon button
  MuiIconButton: {
    defaultProps: {
      style: {
        color: katsuiroColors.neutral.gofun,
      },
    },
    styleOverrides: {
      root: {
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          transform: 'scale(1.05)',
        },
      },
    },
  },
  
  // App bar
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: katsuiroColors.main,
        boxShadow: '0 2px 12px rgba(24, 27, 57, 0.15)',
      },
    },
  },
  
  // Card component
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(24, 27, 57, 0.08)',
        border: `1px solid rgba(24, 27, 57, 0.05)`,
        '&:hover': {
          boxShadow: '0 8px 30px rgba(24, 27, 57, 0.12)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease-in-out',
      },
    },
  },
  
  // Text field
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: katsuiroColors.main,
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: katsuiroColors.main,
        },
      },
    },
  },
  
  // Chip component
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
      colorPrimary: {
        backgroundColor: katsuiroColors.main,
        color: katsuiroColors.neutral.gofun,
      },
      colorSecondary: {
        backgroundColor: katsuiroColors.complementary.yamabuki,
        color: katsuiroColors.main,
      },
    },
  },
}

// Theme creation function
export const createKatsuiroTheme = (mode: PaletteMode = 'light') => {
  const baseTheme = mode === 'light' ? createLightTheme() : createDarkTheme()
  
  return createTheme({
    ...baseTheme,
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        // Japanese fonts
        '"Hiragino Kaku Gothic ProN"',
        '"Hiragino Sans"',
        'Meiryo',
        '"MS PGothic"',
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.01562em',
        color: mode === 'light' ? katsuiroColors.main : katsuiroColors.neutral.gofun,
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        letterSpacing: '-0.00833em',
        color: mode === 'light' ? katsuiroColors.main : katsuiroColors.neutral.gofun,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.00938em',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: commonComponents,
  })
}

// Export default themes
export const theme = createKatsuiroTheme('light')
export const darkTheme = createKatsuiroTheme('dark')

// Theme switching Hook
export const useThemeMode = () => {
  const [mode, setMode] = React.useState<PaletteMode>('light')
  
  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
  }
  
  const currentTheme = React.useMemo(
    () => createKatsuiroTheme(mode),
    [mode]
  )
  
  return {
    theme: currentTheme,
    mode,
    toggleTheme,
  }
}

// Color utility functions
export const katsuiroColorPalette = katsuiroColors

// Usage examples:
/*
import { ThemeProvider } from '@mui/material/styles'
import { theme, darkTheme, useThemeMode } from './theme'

// Basic usage
function App() {
  return (
    <ThemeProvider theme={theme}>
      <YourComponents />
    </ThemeProvider>
  )
}

// With theme switching
function AppWithThemeToggle() {
  const { theme, mode, toggleTheme } = useThemeMode()
  
  return (
    <ThemeProvider theme={theme}>
      <IconButton onClick={toggleTheme}>
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
      <YourComponents />
    </ThemeProvider>
  )
}
*/