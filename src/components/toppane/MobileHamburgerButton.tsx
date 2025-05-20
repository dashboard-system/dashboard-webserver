import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { updatePageStatus } from '../../store/slices/global/global-slice'

function MobileHamburgerButton() {
  const pageStatus = useAppSelector((state) => state.global.pageStatus)
  const dispatch = useAppDispatch()

  const handleDrawerToggle = () => {
    if (!pageStatus.setIsSideBarClosing) {
      dispatch(
        updatePageStatus({
          ...pageStatus,
          isSideBarExpand: !pageStatus.isSideBarExpand,
        }),
      )
    }
  }

  return (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
      sx={{ mr: 2, display: { sm: 'none' } }}
    >
      <MenuIcon />
    </IconButton>
  )
}

export default MobileHamburgerButton
