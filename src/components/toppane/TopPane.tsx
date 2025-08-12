import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MobileHamburgerButton from './MobileHamburgerButton'
import { useAppSelector } from '../../store/hook'
import UserButton from './UserButton'

const drawerWidth = 240

export default function ResponsiveDrawer(_props: object) {
  const system = useAppSelector((state) => {
    const system = state.uci.system?.system
    return system ? system[Object.keys(system)[0]]?.values : null
  })

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
          {system?.greeting || ''}
        </Typography>
        <UserButton />
      </Toolbar>
    </AppBar>
  )
}
