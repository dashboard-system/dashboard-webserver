import './App.css'
import SideBar from './components/sidebar/SideBar'
import TopPane from './components/toppane/TopPane'
import MainContent from './pages/MainContent'

import { Box } from '@mui/material'
import PageSuspenseRoute from './components/suspense/PageSuspenseRoute'
import Error404 from './pages/404/Error404'

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <TopPane />
      <MainContent />
    </Box>
  )
}

export default App
