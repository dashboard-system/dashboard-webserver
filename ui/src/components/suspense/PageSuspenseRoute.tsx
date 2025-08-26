import React, { lazy, Suspense, useMemo, type ComponentType } from 'react'
import Loader from '../Loader'

interface PageSuspenseRouteProps {
  componentName: string
}

const pageMap: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
  landing: lazy(() => import('../../pages/landing/Landing')),
  settings: lazy(() => import('../../pages/settings/Settings')),
  a429: lazy(() => import('../../pages/a429/A429')),
  lights: lazy(() => import('../../pages/lights/Lights')),
  ac: lazy(() => import('../../pages/ac/AC')),
  bluetooth: lazy(() => import('../../pages/bluetooth/Bluetooth')),
  music: lazy(() => import('../../pages/music/Music')),
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
