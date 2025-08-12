import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SideBar from './components/sidebar/SideBar'
import TopPane from './components/toppane/TopPane'
import MainContent from './pages/MainContent'

import ResponsiveDrawer from './demo'
import { Box } from '@mui/material'
import PageSuspenseRoute from './components/suspense/PageSuspenseRoute'
import Error404 from './pages/404/Error404'

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <TopPane />
        <MainContent />
        {/* <ResponsiveDrawer /> */}
      </Box>
    </BrowserRouter>
  )
}

export default App
