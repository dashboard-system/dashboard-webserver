import { Toolbar, Typography } from '@mui/material'
import LogoIcon from '../LogoIcon'

const style = {
  icon: { display: { sm: 'flex' }, mr: 1 },
  text: {
    mr: 2,
    display: { sm: 'flex' },
    fontFamily: 'monospace',
    fontWeight: 700,
    letterSpacing: '.3rem',
    color: 'inherit',
    textDecoration: 'none',
  },
}

function Brand() {
  return (
    <Toolbar>
      {/* <Snowboarding sx={style.icon} /> */}
      <LogoIcon sx={style.icon} fontSize="large" />
      <Typography
        variant="h6"
        noWrap
        component="a"
        color="info"
        sx={style.text}
      >
        haorong
      </Typography>
    </Toolbar>
  )
}

export default Brand
