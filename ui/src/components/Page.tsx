import React, { type ReactNode } from 'react'
import PageTitle from './PageTitle'
import { Box } from '@mui/material'
import { toUpperCaseFirstLetter } from '../libs/utils/utils'

interface PageProps {
  title: string
  children: ReactNode
}

function Page({ title, children }: PageProps) {
  return (
    <Box>
      <PageTitle title={toUpperCaseFirstLetter(title)} />
      {children}
    </Box>
  )
}

export default Page
