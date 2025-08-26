import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
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

<<<<<<< HEAD
    return Object.values(uciLights).map((entry) => {
      const typedEntry = entry as UCILightEntry
      return {
        id: typedEntry.sectionName,
        name: lightNameMap[typedEntry.sectionName] || typedEntry.sectionName,
        brightness: typedEntry.values.brightness,
        enabled: typedEntry.values.enabled === 1,
        uuid: typedEntry.uuid,
      }
    })
=======
    return (Object.values(uciLights) as UCILightEntry[]).map((entry) => ({
      id: entry.sectionName,
      name: lightNameMap[entry.sectionName] || entry.sectionName,
      brightness: entry.values.brightness,
      enabled: entry.values.enabled === 1,
      uuid: entry.uuid,
    }))
>>>>>>> e647c76
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
        enabled: { value: light.enabled ? 1 : 0 },
        brightness: { value },
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
        enabled: { value: light.enabled ? 0 : 1 },
        brightness: { value: light.brightness },
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {lights.map((light) => (
<<<<<<< HEAD
          <Grid size={{ xs: 12, md: 6 }} key={light.id}>
=======
          <Box key={light.id} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' }, minWidth: 0 }}>
>>>>>>> e647c76
            <LightCard
              light={light}
              isUpdating={isUpdating}
              onToggle={handleToggle}
              onBrightnessChange={handleBrightnessChange}
            />
          </Box>
        ))}
      </Box>

      <LightSystemStatus lights={lights} />
    </Box>
  )
}

export default Lights
