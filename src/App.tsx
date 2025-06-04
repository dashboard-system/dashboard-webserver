import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import SideBar from './components/sidebar/SideBar'
import TopPane from './components/toppane/TopPane'
import MainContent from './pages/MainContent'

import ResponsiveDrawer from './demo'
import { Box, ThemeProvider } from '@mui/material'
import PageSuspenseRoute from './components/suspense/PageSuspenseRoute'
import Error404 from './pages/404/Error404'
import { theme } from './theme/DashboardTheme'
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <SideBar />
          <TopPane />
          <MainContent />
          {/* <ResponsiveDrawer /> */}
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  )
}

// function MainContent(_props: object) {
//   const list = [{path:"/123"}]
//   return (
//     <Routes>
//       <Route path="/" element={<PageSuspenseRoute componentName="landing" />} />
//       {/* {
//         list.map(row => <Route path={row[path]} element={<PageSuspenseRoute componentName={row[path]} />})
//       } */}
//       <Route path="*" element={<Error404/>}/>
//     </Routes>
//   )
// }
export default App
