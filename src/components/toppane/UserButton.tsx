import { useState } from 'react'
import { Login, AccountCircle } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useAppSelector } from '../../store/hook'
import LoginDialog from '../LoginDialog'

function UserButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isLogin = useAppSelector((state) => state.global.pageStatus.isLogin)

  const handleToggleLogin = () => {
    setIsDialogOpen(!isDialogOpen)
  }

  const userOnClickHandler = (_ev: React.MouseEvent<HTMLElement>) => {
    console.log('clicked')
  }

  const loginOnClickHandler = (_ev: React.MouseEvent<HTMLElement>) => {
    setIsDialogOpen(true)
  }
  return (
    <>
      {isLogin ? (
        <Tooltip title="User" onClick={userOnClickHandler}>
          <IconButton>
            <AccountCircle />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Login" onClick={loginOnClickHandler}>
          <IconButton>
            <Login />
          </IconButton>
        </Tooltip>
      )}
      <LoginDialog open={isDialogOpen} toggleLogin={handleToggleLogin} />
    </>
  )
}

export default UserButton
