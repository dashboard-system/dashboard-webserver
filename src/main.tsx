import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SnackbarProvider } from 'notistack'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme/DashboardTheme.ts'
import { PageContextProvider } from './components/context/PageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <ThemeProvider theme={theme} defaultMode="light">
        <Provider store={store}>
          <PageContextProvider>
            <CssBaseline />
            <App />
          </PageContextProvider>
        </Provider>
      </ThemeProvider>
    </SnackbarProvider>
  </StrictMode>,
)
