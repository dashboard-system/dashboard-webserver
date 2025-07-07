import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MailIcon from '@mui/icons-material/Mail'
import Brand from './Brand'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { updatePageStatus } from '../../store/slices/global/global-slice'
import { lazySidebarIcons } from '../../libs/constants/sidebar'
import { Link } from 'react-router'
import type { PageItem } from '../../libs/store/global'
import React, { Suspense } from 'react'
import PageList from './PageList'

const drawerWidth = 240

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window
}

export default function SideBar(props: Props) {
  const pageStatus = useAppSelector((state) => state.global.pageStatus)
  const pageList = useAppSelector((state) => state.global.pageList)
  const { isLogin } = pageStatus
  const dispatch = useAppDispatch()
  const { window } = props

  const handleDrawerClose = () => {
    dispatch(
      updatePageStatus({
        ...pageStatus,
        isSideBarClosing: true,
        isSideBarExpand: false,
      }),
    )
  }

  const handleDrawerTransitionEnd = () => {
    dispatch(
      updatePageStatus({
        ...pageStatus,
        isSideBarClosing: false,
      }),
    )
  }

  const createSideBarIcon = (name: string) => {
    return React.createElement(lazySidebarIcons[name])
  }

  const drawer = (
    <>
      <Brand />
      <Divider />
      <List>
        {pageList.map((pageItem: PageItem, index) => (
          <ListItem key={pageItem.label} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                <Suspense fallback={null}>
                  {createSideBarIcon(pageItem.componentName)}
                </Suspense>
              </ListItemIcon>
              <Link to={pageItem.path} color="inherit">
                <ListItemText primary={pageItem.label} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={pageStatus.isSideBarExpand}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          <Brand />
          <Divider />
          <Suspense>{isLogin ? <PageList /> : <></>}</Suspense>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          <Brand />
          <Divider />
          <Suspense>{isLogin ? <PageList /> : <></>}</Suspense>
        </Drawer>
      </Box>
    </>
  )
}
