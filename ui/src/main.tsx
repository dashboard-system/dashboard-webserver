import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { CssBaseline } from '@mui/material'
import { CustomThemeProvider } from './contexts/ThemeContext'
import { PageContextProvider } from './components/context/PageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <Provider store={store}>
        <CustomThemeProvider>
          <BrowserRouter>
            <PageContextProvider>
              <CssBaseline />
              <App />
            </PageContextProvider>
          </BrowserRouter>
        </CustomThemeProvider>
      </Provider>
    </SnackbarProvider>
  </StrictMode>,
)
