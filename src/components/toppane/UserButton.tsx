import { useState } from 'react'
import { Login, AccountCircle, Logout } from '@mui/icons-material'
import { 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useSecureAuth from '../context/useSecureAuth'
import LoginDialog from '../LoginDialog'

function UserButton() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useSecureAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const handleToggleLogin = () => {
    setIsDialogOpen(!isDialogOpen)
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setAnchorEl(null) // Close the user menu
    setLogoutDialogOpen(true) // Open confirmation dialog
  }

  const handleLogoutConfirm = () => {
    logout() // Call the logout function from useSecureAuth
    setLogoutDialogOpen(false)
    navigate('/') // Navigate to home page after logout
  }

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false)
  }

  // const handleSettingsClick = () => {
  //   setAnchorEl(null) // Close the user menu
  //   navigate('/settings')
  // }

  const loginOnClickHandler = (_ev: React.MouseEvent<HTMLElement>) => {
    setIsDialogOpen(true)
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <Tooltip title="User Menu">
            <IconButton onClick={handleUserMenuOpen}>
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {/* <MenuItem onClick={handleSettingsClick}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem> */}
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Tooltip title="Login">
          <IconButton onClick={loginOnClickHandler}>
            <Login />
          </IconButton>
        </Tooltip>
      )}
      
      <LoginDialog open={isDialogOpen} toggleLogin={handleToggleLogin} />
      
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout? You will need to login again to access the dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" variant="contained" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserButton
