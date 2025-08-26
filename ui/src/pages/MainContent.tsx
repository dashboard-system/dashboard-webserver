import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Route } from 'react-router'
import { Routes } from 'react-router'
import PageSuspenseRoute from '../components/suspense/PageSuspenseRoute'
import Error404 from './404/Error404'
import { useAppSelector } from '../store/hook'
import type { PageItem } from '../libs/store/global'

const drawerWidth = 240

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window
}

export default function MainContent(props: Props) {
  const pageList = useAppSelector((state) => state.global.pageList)
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ width: '70vw', height: '100vh' }}>
          <Routes>
            <Route
              path="/"
              element={<PageSuspenseRoute componentName="landing" />}
            />
            {pageList.map((pageItem: PageItem) => (
              <Route
                key={pageItem.path}
                path={pageItem.path}
                element={
                  <PageSuspenseRoute componentName={pageItem.componentName} />
                }
              />
            ))}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}
