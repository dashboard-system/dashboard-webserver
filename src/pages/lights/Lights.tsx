import { useMemo } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../../store/hook'
import { useUpdateUCIEntryMutation } from '../../store/slices/uci/uci-api-slice'
import { editTopic } from '../../store/slices/uci/uci-slice'
import LightCard from '../../components/LightCard'
import LightSystemStatus from '../../components/LightSystemStatus'


interface UCILightEntry {
  uuid: string
  sectionType: string
  sectionName: string
  fileName: string
  values: {
    enabled: number
    brightness: number
  }
  lastModified: string
}

function Lights() {
  const dispatch = useAppDispatch()
  const uciLights = useAppSelector((state) => state.uci?.lights?.controls)
  const [updateUCIEntry, { isLoading: isUpdating }] =
    useUpdateUCIEntryMutation()

  // Transform UCI data to component format
  const lights = useMemo(() => {
    if (!uciLights) return []

    const lightNameMap: Record<string, string> = {
      cockpit: 'Cockpit Lights',
      cabin: 'Cabin Lights',
      controls_6: 'Exterior Lights', // This seems to be controls_6 in the data
      instrument: 'Instrument Panel',
      reading: 'Reading Lights',
    }

    return Object.values(uciLights).map((entry: UCILightEntry) => ({
      id: entry.sectionName,
      name: lightNameMap[entry.sectionName] || entry.sectionName,
      brightness: entry.values.brightness,
      enabled: entry.values.enabled === 1,
      uuid: entry.uuid,
    }))
  }, [uciLights])

  const handleBrightnessChange = async (id: string, value: number) => {
    const light = lights.find((l) => l.id === id)
    if (!light) return

    // Update local UCI state first
    const updatedEntry = {
      ...uciLights[light.uuid],
      values: {
        ...uciLights[light.uuid].values,
        brightness: value,
      },
      lastModified: new Date().toISOString(),
    }

    dispatch(
      editTopic({
        fileName: 'lights',
        sectionName: 'controls',
        uuid: light.uuid,
        data: updatedEntry,
      }),
    )

    // Fire and forget - don't await to prevent UI blocking
    updateUCIEntry({
      uuid: light.uuid,
      sectionType: 'controls',
      sectionName: light.id,
      fileName: 'lights',
      values: {
        enabled: light.enabled ? 1 : 0,
        brightness: value,
      },
      lastModified: new Date().toISOString(),
    }).catch((error) => {
      console.error('Failed to update light brightness:', error)
    })
  }

  const handleToggle = async (id: string) => {
    const light = lights.find((l) => l.id === id)
    if (!light) return

    // Update local UCI state first
    const updatedEntry = {
      ...uciLights[light.uuid],
      values: {
        ...uciLights[light.uuid].values,
        enabled: light.enabled ? 0 : 1,
      },
      lastModified: new Date().toISOString(),
    }

    dispatch(
      editTopic({
        fileName: 'lights',
        sectionName: 'controls',
        uuid: light.uuid,
        data: updatedEntry,
      }),
    )

    // Fire and forget - don't await to prevent UI blocking
    updateUCIEntry({
      uuid: light.uuid,
      sectionType: 'controls',
      sectionName: light.id,
      fileName: 'lights',
      values: {
        enabled: light.enabled ? 0 : 1,
        brightness: light.brightness,
      },
      lastModified: new Date().toISOString(),
    }).catch((error) => {
      console.error('Failed to toggle light:', error)
    })
  }

  // Show loading or empty state when no data
  if (!uciLights) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Lighting Controls
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Loading lighting controls...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Lighting Controls
      </Typography>

      <Grid container spacing={3}>
        {lights.map((light) => (
          <Grid item xs={12} md={6} key={light.id}>
            <LightCard
              light={light}
              isUpdating={isUpdating}
              onToggle={handleToggle}
              onBrightnessChange={handleBrightnessChange}
            />
          </Grid>
        ))}
      </Grid>

      <LightSystemStatus lights={lights} />
    </Box>
  )
}

export default Lights
