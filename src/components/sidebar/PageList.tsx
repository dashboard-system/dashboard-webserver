import React, { Suspense } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useAppSelector } from '../../store/hook'
import type { PageItem } from '../../libs/store/global'
import { lazySidebarIcons } from '../../libs/constants/sidebar'
import { Link } from 'react-router'

function PageList() {
  const pageList = useAppSelector((state) => state.global.pageList)
  
  const createSideBarIcon = (name: string) => {
    return React.createElement(lazySidebarIcons[name])
  }
  return (
    <List>
      {pageList.map((pageItem: PageItem, index) => (
        <ListItem key={pageItem.label} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              <Suspense fallback={null}>
                {createSideBarIcon(pageItem.componentName)}
              </Suspense>
            </ListItemIcon>
            <Link to={pageItem.path} color="inherit">
              <ListItemText primary={pageItem.label} />
            </Link>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default PageList
