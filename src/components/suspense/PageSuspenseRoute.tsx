import React, { lazy, Suspense, useMemo, type ComponentType } from 'react'
import Loader from '../Loader'

interface PageSuspenseRouteProps {
  componentName: string
}

const pageMap: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
  landing: lazy(() => import('../../pages/landing/Landing')),
  settings: lazy(() => import('../../pages/settings/Settings')),
}

function PageSuspenseRoute({ componentName }: PageSuspenseRouteProps) {
  const DisplayedPage = useMemo(() => pageMap[componentName], [componentName])
  
  if (!DisplayedPage) {
    return <div>Component not found: {componentName}</div>
  }

  return (
    <Suspense fallback={<Loader />}>
      <DisplayedPage componentName={componentName} />
    </Suspense>
  )
}

export default PageSuspenseRoute
