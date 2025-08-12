import { Toolbar, Typography } from '@mui/material'
import LogoIcon from '../LogoIcon'
import { useNavigate } from 'react-router-dom'

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
    cursor: 'pointer',
  },
  toolbar: {
    cursor: 'pointer',
  }
}

function  Brand() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/')
  }

  return (
    <Toolbar onClick={handleClick} sx={style.toolbar}>
      <LogoIcon sx={style.icon} fontSize="large" />
      <Typography
        variant="h6"
        noWrap
        component="div"
        color="info"
        sx={style.text}
      >
        Cabin
      </Typography>
    </Toolbar>
  )
}

export default Brand
