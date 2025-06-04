import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MobileHamburgerButton from './MobileHamburgerButton'
import { useAppSelector } from '../../store/hook'
import UserButton from './UserButton'

const drawerWidth = 240

export default function ResponsiveDrawer(_props: object) {
  const greetings = useAppSelector((state) => state.global.greetings)
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <MobileHamburgerButton />
        <Typography variant="h6" noWrap component="div">
          {greetings}
        </Typography>
        <UserButton />
      </Toolbar>
    </AppBar>
  )
}
