import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme/DashboardTheme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode="dark">
      <Provider store={store}>
        <CssBaseline />
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)
