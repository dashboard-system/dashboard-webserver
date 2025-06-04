import { lazy, type JSX } from 'react'
import type { LazyExoticComponent, ComponentType } from 'react'

type IconComponent = LazyExoticComponent<ComponentType<JSX.IntrinsicAttributes>>

const lazySidebarIcons: Record<string, IconComponent> = {
  settings: lazy(() => import('@mui/icons-material/Settings')),
}

export { lazySidebarIcons }
