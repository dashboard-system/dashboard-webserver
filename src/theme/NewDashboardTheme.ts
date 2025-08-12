import { createTheme, ThemeOptions } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
import React from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'

// Dashboard color palette
const dashboardColors = {
  // Tesla's signature blue
  blue: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',  // Primary Tesla blue
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Dark theme backgrounds
  dark: {
    primary: '#000000',      // Pure black like Tesla UI
    secondary: '#111111',    // Slightly lighter black
    tertiary: '#1C1C1E',     // Card backgrounds
    quaternary: '#2C2C2E',   // Elevated elements
  },
  
  // Light theme backgrounds
  light: {
    primary: '#FFFFFF',
    secondary: '#F5F5F7',
    tertiary: '#FFFFFF',
    quaternary: '#F0F0F0',
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#666666',
    darkPrimary: '#1C1C1E',
    darkSecondary: '#8E8E93',
  },
  
  // Status colors
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF3B30',
  
  // Gray scale
  gray: {
    50: '#F9F9FB',
    100: '#F0F0F3',
    200: '#E1E1E6',
    300: '#C7C7CC',
    400: '#8E8E93',
    500: '#636366',
    600: '#48484A',
    700: '#3A3A3C',
    800: '#2C2C2E',
    900: '#1C1C1E',
  }
}

// Create dashboard dark theme (primary theme)
const createDashboardDarkTheme = (): ThemeOptions => ({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: dashboardColors.blue[500],
      light: dashboardColors.blue[400],
      dark: dashboardColors.blue[700],
      contrastText: dashboardColors.text.primary,
    },
    secondary: {
      main: dashboardColors.gray[400],
      light: dashboardColors.gray[300],
      dark: dashboardColors.gray[600],
      contrastText: dashboardColors.text.primary,
    },
    error: {
      main: dashboardColors.error,
      light: '#FF6961',
      dark: '#CC2E24',
      contrastText: dashboardColors.text.primary,
    },
    warning: {
      main: dashboardColors.warning,
      light: '#FFB340',
      dark: '#CC7F08',
      contrastText: dashboardColors.text.primary,
    },
    info: {
      main: dashboardColors.blue[400],
      light: dashboardColors.blue[300],
      dark: dashboardColors.blue[600],
      contrastText: dashboardColors.text.primary,
    },
    success: {
      main: dashboardColors.success,
      light: '#5EDB73',
      dark: '#26A746',
      contrastText: dashboardColors.text.primary,
    },
    background: {
      default: dashboardColors.dark.primary,
      paper: dashboardColors.dark.tertiary,
    },
    text: {
      primary: dashboardColors.text.primary,
      secondary: dashboardColors.text.secondary,
      disabled: dashboardColors.text.disabled,
    },
    divider: dashboardColors.gray[800],
  },
})

// Create dashboard light theme
const createDashboardLightTheme = (): ThemeOptions => ({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: dashboardColors.blue[600],
      light: dashboardColors.blue[400],
      dark: dashboardColors.blue[800],
      contrastText: dashboardColors.text.primary,
    },
    secondary: {
      main: dashboardColors.gray[600],
      light: dashboardColors.gray[400],
      dark: dashboardColors.gray[800],
      contrastText: dashboardColors.text.primary,
    },
    background: {
      default: dashboardColors.light.primary,
      paper: dashboardColors.light.tertiary,
    },
    text: {
      primary: dashboardColors.text.darkPrimary,
      secondary: dashboardColors.text.darkSecondary,
    },
  },
})

// Dashboard component styles
const dashboardComponents = (mode: PaletteMode) => ({
  // Global styles
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: mode === 'dark' ? dashboardColors.dark.primary : dashboardColors.light.primary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        // Mobile app-like behavior
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
      },
      // Ensure labels and text elements are not selectable
      'label, span, p, h1, h2, h3, h4, h5, h6, div': {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      },
    },
  },

  // Button component
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none' as const,
        fontWeight: 600,
        fontSize: '14px',
        padding: '10px 20px',
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 'none',
          transform: 'translateY(-1px)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: `0 4px 20px ${mode === 'dark' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.2)'}`,
        },
      },
      outlined: {
        borderColor: mode === 'dark' ? dashboardColors.gray[700] : dashboardColors.gray[300],
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
        '&:hover': {
          borderColor: dashboardColors.blue[500],
          backgroundColor: mode === 'dark' ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.04)',
        },
      },
    },
  },

  // Icon button
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: mode === 'dark' ? dashboardColors.gray[800] : dashboardColors.gray[100],
          transform: 'scale(1.05)',
        },
      },
    },
  },

  // Card component
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'dark' ? dashboardColors.dark.tertiary : dashboardColors.light.tertiary,
        borderRadius: 16,
        border: `1px solid ${mode === 'dark' ? dashboardColors.gray[800] : dashboardColors.gray[200]}`,
        boxShadow: mode === 'dark' 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
          : '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: mode === 'dark'
            ? '0 8px 30px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },

  // Switch component (like Tesla toggles)
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 52,
        height: 32,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: dashboardColors.blue[500],
              opacity: 1,
              border: 0,
            },
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 28,
          height: 28,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        '& .MuiSwitch-track': {
          borderRadius: 16,
          backgroundColor: mode === 'dark' ? dashboardColors.gray[700] : dashboardColors.gray[300],
          opacity: 1,
          transition: 'background-color 300ms',
        },
      },
    },
  },

  // Slider component
  MuiSlider: {
    styleOverrides: {
      root: {
        color: dashboardColors.blue[500],
        height: 6,
        '& .MuiSlider-track': {
          border: 'none',
          borderRadius: 3,
        },
        '& .MuiSlider-rail': {
          backgroundColor: mode === 'dark' ? dashboardColors.gray[700] : dashboardColors.gray[300],
          opacity: 1,
          borderRadius: 3,
        },
        '& .MuiSlider-thumb': {
          height: 20,
          width: 20,
          backgroundColor: dashboardColors.blue[500],
          border: `2px solid ${mode === 'dark' ? dashboardColors.dark.primary : dashboardColors.light.primary}`,
          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
          },
        },
      },
    },
  },

  // Linear Progress (like Tesla progress bars)
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        height: 6,
        borderRadius: 3,
        backgroundColor: mode === 'dark' ? dashboardColors.gray[800] : dashboardColors.gray[200],
      },
      bar: {
        borderRadius: 3,
        backgroundColor: dashboardColors.blue[500],
      },
    },
  },

  // Chip component
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontSize: '12px',
        fontWeight: 600,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      },
      colorPrimary: {
        backgroundColor: dashboardColors.blue[500],
        color: dashboardColors.text.primary,
      },
      colorSecondary: {
        backgroundColor: mode === 'dark' ? dashboardColors.gray[700] : dashboardColors.gray[200],
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
      },
    },
  },

  // Typography component
  MuiTypography: {
    styleOverrides: {
      root: {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      },
    },
  },

  // Form components that should prevent selection
  MuiFormLabel: {
    styleOverrides: {
      root: {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      },
    },
  },

  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      },
    },
  },

  // Input fields should allow text selection
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-input': {
          userSelect: 'text !important',
          WebkitUserSelect: 'text !important',
          MozUserSelect: 'text !important',
          msUserSelect: 'text !important',
        },
      },
    },
  },

  MuiInputBase: {
    styleOverrides: {
      input: {
        userSelect: 'text !important',
        WebkitUserSelect: 'text !important',
        MozUserSelect: 'text !important',
        msUserSelect: 'text !important',
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        userSelect: 'text !important',
        WebkitUserSelect: 'text !important',
        MozUserSelect: 'text !important',
        msUserSelect: 'text !important',
      },
    },
  },

  // List components
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: '4px 0',
        '&:hover': {
          backgroundColor: mode === 'dark' ? dashboardColors.gray[800] : dashboardColors.gray[100],
        },
        '&.Mui-selected': {
          backgroundColor: mode === 'dark' 
            ? 'rgba(33, 150, 243, 0.12)' 
            : 'rgba(33, 150, 243, 0.08)',
          '&:hover': {
            backgroundColor: mode === 'dark' 
              ? 'rgba(33, 150, 243, 0.16)' 
              : 'rgba(33, 150, 243, 0.12)',
          },
        },
      },
    },
  },

  // List item text
  MuiListItemText: {
    styleOverrides: {
      root: {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      },
      primary: {
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
        fontWeight: 500,
        fontSize: '14px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      },
      secondary: {
        color: mode === 'dark' ? dashboardColors.text.secondary : dashboardColors.text.darkSecondary,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      },
    },
  },

  // Paper component
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'dark' ? dashboardColors.dark.tertiary : dashboardColors.light.tertiary,
        borderRadius: 12,
      },
    },
  },

  // Dialog components
  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundColor: mode === 'dark' ? dashboardColors.dark.secondary : dashboardColors.light.primary,
        borderRadius: 16,
      },
    },
  },
})

// Theme creation function
export const createDashboardTheme = (mode: PaletteMode = 'dark') => {
  const baseTheme = mode === 'light' ? createDashboardLightTheme() : createDashboardDarkTheme()
  
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
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.02em',
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        letterSpacing: '-0.01em',
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        letterSpacing: '-0.01em',
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '-0.01em',
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '-0.01em',
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        letterSpacing: '-0.01em',
        color: mode === 'dark' ? dashboardColors.text.primary : dashboardColors.text.darkPrimary,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01071em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: dashboardComponents(mode),
  })
}

// Export default themes
export const dashboardTheme = createDashboardTheme('dark')
export const dashboardLightTheme = createDashboardTheme('light')

// Theme switching Hook
export const useDashboardTheme = () => {
  const [mode, setMode] = React.useState<PaletteMode>('dark')
  
  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
  }
  
  const currentTheme = React.useMemo(
    () => createDashboardTheme(mode),
    [mode]
  )
  
  return {
    theme: currentTheme,
    mode,
    toggleTheme,
  }
}

// Color utility functions
export const dashboardColorPalette = dashboardColors