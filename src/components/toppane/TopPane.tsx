import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MobileHamburgerButton from './MobileHamburgerButton'
import { useAppSelector } from '../../store/hook'

const drawerWidth = 240

export default function ResponsiveDrawer(_props: object) {
  const gettings = useAppSelector((state) => state.global.gettings)
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <MobileHamburgerButton />
        <Typography variant="h6" noWrap component="div">
          {gettings}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
