import React, { Suspense } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useAppSelector, useAppDispatch } from '../../store/hook'
import type { PageItem } from '../../libs/store/global'
import { lazySidebarIcons } from '../../libs/constants/sidebar'
import { useNavigate } from 'react-router'
import { setCurrentPage } from '../../store/slices/global/global-slice'

function PageList() {
  const pageList = useAppSelector((state) => state.global.pageList)
  const currentPage = useAppSelector((state) => state.global.pageStatus.currentPage)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const createSideBarIcon = (name: string) => {
    return React.createElement(lazySidebarIcons[name])
  }

  const handleNavigation = (path: string, componentName: string) => {
    navigate(path)
    dispatch(setCurrentPage(componentName))
  }
  return (
    <List>
      {pageList.map((pageItem: PageItem, index) => {
        const isSelected = currentPage === pageItem.componentName
        return (
          <ListItem key={pageItem.label} disablePadding>
            <ListItemButton 
              selected={isSelected}
              onClick={() => handleNavigation(pageItem.path, pageItem.componentName)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(33, 150, 243, 0.12)',
                  borderLeft: '3px solid #2196F3',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.16)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isSelected ? '#2196F3' : 'inherit' }}>
                <Suspense fallback={null}>
                  {createSideBarIcon(pageItem.componentName)}
                </Suspense>
              </ListItemIcon>
              <ListItemText 
                primary={pageItem.label} 
                sx={{ 
                  color: isSelected ? '#2196F3' : 'white',
                  '& .MuiTypography-root': {
                    fontWeight: isSelected ? 600 : 400,
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}

export default PageList
