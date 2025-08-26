import { lazy, type JSX } from 'react'
import type { LazyExoticComponent, ComponentType } from 'react'

type IconComponent = LazyExoticComponent<ComponentType<JSX.IntrinsicAttributes>>

const lazySidebarIcons: Record<string, IconComponent> = {
  settings: lazy(() => import('@mui/icons-material/Settings')),
  a429: lazy(() => import('@mui/icons-material/Flight')),
  lights: lazy(() => import('@mui/icons-material/Lightbulb')),
  ac: lazy(() => import('@mui/icons-material/Thermostat')),
  bluetooth: lazy(() => import('@mui/icons-material/Bluetooth')),
  music: lazy(() => import('@mui/icons-material/MusicNote')),
}

export { lazySidebarIcons }
