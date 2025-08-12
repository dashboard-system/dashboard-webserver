import React, { Suspense } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useAppSelector } from '../../store/hook'
import type { PageItem } from '../../libs/store/global'
import { lazySidebarIcons } from '../../libs/constants/sidebar'
import { useNavigate } from 'react-router'

function PageList() {
  const pageList = useAppSelector((state) => state.global.pageList)
  const navigate = useNavigate()
  
  const createSideBarIcon = (name: string) => {
    return React.createElement(lazySidebarIcons[name])
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }
  return (
    <List>
      {pageList.map((pageItem: PageItem, index) => (
        <ListItem key={pageItem.label} disablePadding>
          <ListItemButton onClick={() => handleNavigation(pageItem.path)}>
            <ListItemIcon>
              <Suspense fallback={null}>
                {createSideBarIcon(pageItem.componentName)}
              </Suspense>
            </ListItemIcon>
            <ListItemText primary={pageItem.label} sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default PageList
