import type { ReactNode } from 'react'
import type { CardProps, SxProps, Theme } from '@mui/material'
import { Card, CardHeader, CardContent, CardActions, Box, Divider } from '@mui/material'

export type CardVariant = 'default' | 'table' | 'list' | 'graph' | 'stats'
export type CardSize = 'small' | 'medium' | 'large'

type Props = CardProps & {
  title?: string
  subheader?: string
  variant?: CardVariant
  size?: CardSize
  showDivider?: boolean
  headerAction?: ReactNode
  footerActions?: ReactNode
  contentPadding?: boolean
  minHeight?: string | number
}

const getVariantStyles = (variant: CardVariant): SxProps<Theme> => {
  switch (variant) {
    case 'table':
      return {
        '& .MuiCardContent-root': {
          padding: 0,
          '&:last-child': { paddingBottom: 0 }
        }
      }
    case 'list':
      return {
        '& .MuiCardContent-root': {
          padding: { xs: 1, sm: 2 },
          '&:last-child': { paddingBottom: { xs: 1, sm: 2 } }
        }
      }
    case 'graph':
      return {
        '& .MuiCardContent-root': {
          padding: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 300
        }
      }
    case 'stats':
      return {
        '& .MuiCardContent-root': {
          textAlign: 'center',
          padding: { xs: 2, sm: 3 }
        }
      }
    default:
      return {}
  }
}

const getSizeStyles = (size: CardSize): SxProps<Theme> => {
  switch (size) {
    case 'small':
      return {
        maxWidth: 400,
        '& .MuiCardHeader-root': {
          paddingBottom: 1
        }
      }
    case 'medium':
      return {
        maxWidth: 600,
        '& .MuiCardHeader-root': {
          paddingBottom: 2
        }
      }
    case 'large':
      return {
        '& .MuiCardHeader-root': {
          paddingBottom: 2
        }
      }
    default:
      return {}
  }
}

export default function PageCard({
  title,
  subheader,
  variant = 'default',
  size = 'medium',
  showDivider = false,
  headerAction,
  footerActions,
  contentPadding = true,
  minHeight,
  sx,
  children,
  ...other
}: Props) {
  const variantStyles = getVariantStyles(variant)
  const sizeStyles = getSizeStyles(size)

  const combinedSx: SxProps<Theme> = {
    ...sizeStyles,
    ...variantStyles,
    ...(minHeight && { minHeight }),
    ...sx
  }

  return (
    <Card 
      sx={combinedSx}
      {...other}
    >
      {(title || subheader || headerAction) && (
        <>
          <CardHeader 
            title={title} 
            subheader={subheader}
            action={headerAction}
            sx={{
              '& .MuiCardHeader-title': {
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                fontWeight: 600
              },
              '& .MuiCardHeader-subheader': {
                fontSize: { xs: '0.85rem', sm: '0.875rem' }
              }
            }}
          />
          {showDivider && <Divider />}
        </>
      )}
      
      <CardContent 
        sx={{
          ...(variant === 'table' && { padding: 0, '&:last-child': { paddingBottom: 0 } }),
          ...(!contentPadding && { padding: 0, '&:last-child': { paddingBottom: 0 } })
        }}
      >
        {children}
      </CardContent>

      {footerActions && (
        <>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1.5 }}>
            {footerActions}
          </CardActions>
        </>
      )}
    </Card>
  )
}
