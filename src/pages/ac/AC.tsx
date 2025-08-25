import React, { useState, useMemo } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import AirIcon from '@mui/icons-material/Air'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { useAppSelector, useAppDispatch } from '../../store/hook'
import { useUpdateUCIEntryMutation } from '../../store/slices/uci/uci-api-slice'
import { editTopic } from '../../store/slices/uci/uci-slice'

interface UCIACEntry {
  uuid: string
  sectionType: string
  sectionName: string
  fileName: string
  values: {
    enabled: number
    target_temp: number
    fan_speed: number
    mode: string
  }
  lastModified: string
}

function AC() {
  const dispatch = useAppDispatch()
  const uciAC = useAppSelector((state) => state.uci?.ac?.controls)
  const [updateUCIEntry, { isLoading: isUpdating }] = useUpdateUCIEntryMutation()

  // Transform UCI data to component format
  const zones = useMemo(() => {
    if (!uciAC) return []

    const zoneNameMap: Record<string, string> = {
      cockpit: 'Cockpit',
      cabin: 'Cabin', 
      cargo: 'Cargo Hold',
    }

<<<<<<< HEAD
    return Object.values(uciAC).map((entry) => {
      const typedEntry = entry as UCIACEntry
      return {
        id: typedEntry.sectionName,
        name: zoneNameMap[typedEntry.sectionName] || typedEntry.sectionName,
        temperature: typedEntry.values.target_temp + 1, // Mock current temp
        targetTemp: typedEntry.values.target_temp,
        enabled: typedEntry.values.enabled === 1,
        mode: typedEntry.values.mode as 'cool' | 'heat' | 'auto',
        fanSpeed: typedEntry.values.fan_speed,
        uuid: typedEntry.uuid,
      }
    })
=======
    return (Object.values(uciAC) as UCIACEntry[]).map((entry) => ({
      id: entry.sectionName,
      name: zoneNameMap[entry.sectionName] || entry.sectionName,
      temperature: entry.values.target_temp + 1, // Mock current temp
      targetTemp: entry.values.target_temp,
      enabled: entry.values.enabled === 1,
      mode: entry.values.mode as 'cool' | 'heat' | 'auto',
      fanSpeed: entry.values.fan_speed,
      uuid: entry.uuid,
    }))
>>>>>>> e647c76
  }, [uciAC])

  const [masterEnabled, setMasterEnabled] = useState(true)

  const handleTargetTempChange = async (id: string, value: number) => {
    const zone = zones.find((z) => z.id === id)
    if (!zone) return

    // Update local UCI state first
    const updatedEntry = {
      ...uciAC[zone.uuid],
      values: {
        ...uciAC[zone.uuid].values,
        target_temp: value,
      },
      lastModified: new Date().toISOString(),
    }

    dispatch(editTopic({
      fileName: 'ac',
      sectionName: 'controls',
      uuid: zone.uuid,
      data: updatedEntry,
    }))

    // Fire and forget - don't await to prevent UI blocking
    updateUCIEntry({
      uuid: zone.uuid,
      sectionType: 'controls',
      sectionName: zone.id,
      fileName: 'ac',
      values: {
        enabled: { value: zone.enabled ? 1 : 0 },
        target_temp: { value },
        fan_speed: { value: zone.fanSpeed },
        mode: { value: zone.mode },
      },
      lastModified: new Date().toISOString(),
    }).catch((error) => {
      console.error('Failed to update AC target temperature:', error)
    })
  }

  const handleFanSpeedChange = async (id: string, value: number) => {
    const zone = zones.find((z) => z.id === id)
    if (!zone) return

    // Update local UCI state first
    const updatedEntry = {
      ...uciAC[zone.uuid],
      values: {
        ...uciAC[zone.uuid].values,
        fan_speed: value,
      },
      lastModified: new Date().toISOString(),
    }

    dispatch(editTopic({
      fileName: 'ac',
      sectionName: 'controls',
      uuid: zone.uuid,
      data: updatedEntry,
    }))

    // Fire and forget
    updateUCIEntry({
      uuid: zone.uuid,
      sectionType: 'controls',
      sectionName: zone.id,
      fileName: 'ac',
      values: {
        enabled: { value: zone.enabled ? 1 : 0 },
        target_temp: { value: zone.targetTemp },
        fan_speed: { value },
        mode: { value: zone.mode },
      },
      lastModified: new Date().toISOString(),
    }).catch((error) => {
      console.error('Failed to update AC fan speed:', error)
    })
  }

  const handleToggle = async (id: string) => {
    const zone = zones.find((z) => z.id === id)
    if (!zone) return

    // Update local UCI state first
    const updatedEntry = {
      ...uciAC[zone.uuid],
      values: {
        ...uciAC[zone.uuid].values,
        enabled: zone.enabled ? 0 : 1,
      },
      lastModified: new Date().toISOString(),
    }

    dispatch(editTopic({
      fileName: 'ac',
      sectionName: 'controls',
      uuid: zone.uuid,
      data: updatedEntry,
    }))

    // Fire and forget
    updateUCIEntry({
      uuid: zone.uuid,
      sectionType: 'controls',
      sectionName: zone.id,
      fileName: 'ac',
      values: {
        enabled: { value: zone.enabled ? 0 : 1 },
        target_temp: { value: zone.targetTemp },
        fan_speed: { value: zone.fanSpeed },
        mode: { value: zone.mode },
      },
      lastModified: new Date().toISOString(),
    }).catch((error) => {
      console.error('Failed to toggle AC:', error)
    })
  }

  const handleModeChange = async (id: string, mode: 'cool' | 'heat' | 'auto') => {
    const zone = zones.find((z) => z.id === id)
    if (!zone) return

    // Update local UCI state first
    const updatedEntry = {
      ...uciAC[zone.uuid],
      values: {
        ...uciAC[zone.uuid].values,
        mode: mode,
      },
      lastModified: new Date().toISOString(),
    }

    dispatch(editTopic({
      fileName: 'ac',
      sectionName: 'controls',
      uuid: zone.uuid,
      data: updatedEntry,
    }))

    // Fire and forget
    updateUCIEntry({
      uuid: zone.uuid,
      sectionType: 'controls',
      sectionName: zone.id,
      fileName: 'ac',
      values: {
        enabled: { value: zone.enabled ? 1 : 0 },
        target_temp: { value: zone.targetTemp },
        fan_speed: { value: zone.fanSpeed },
        mode: { value: mode },
      },
      lastModified: new Date().toISOString(),
    }).catch((error) => {
      console.error('Failed to update AC mode:', error)
    })
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'cool': return <AcUnitIcon />
      case 'heat': return <LocalFireDepartmentIcon />
      default: return <ThermostatIcon />
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'cool': return 'info.main'
      case 'heat': return 'error.main'
      default: return 'warning.main'
    }
  }

  // Show loading or empty state when no data
  if (!uciAC) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Air Conditioning
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Loading AC controls...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Air Conditioning
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={masterEnabled}
              onChange={() => setMasterEnabled(!masterEnabled)}
              size="medium"
            />
          }
          label="Master AC"
          sx={{ ml: 2 }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {zones.map((zone) => (
<<<<<<< HEAD
          <Grid size={{ xs: 12, lg: 4 }} key={zone.id}>
=======
          <Box key={zone.id} sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}>
>>>>>>> e647c76
            <Card elevation={2} sx={{ opacity: !masterEnabled ? 0.6 : 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ThermostatIcon sx={{ mr: 2, color: getModeColor(zone.mode) }} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {zone.name}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={zone.enabled}
                        onChange={() => handleToggle(zone.id)}
                        disabled={!masterEnabled || isUpdating}
                      />
                    }
                    label=""
                    sx={{ m: 0 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip 
                    label={`Current: ${zone.temperature}°C`} 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    icon={getModeIcon(zone.mode)}
                    label={zone.mode.toUpperCase()} 
                    sx={{ bgcolor: getModeColor(zone.mode), color: 'white' }}
                    size="small"
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography gutterBottom>
                  Target Temperature: {zone.targetTemp}°C
                </Typography>
                <Slider
                  value={zone.targetTemp}
                  onChange={(_, value) => handleTargetTempChange(zone.id, value as number)}
                  disabled={!zone.enabled || !masterEnabled || isUpdating}
                  min={10}
                  max={30}
                  step={1}
                  marks={[
                    { value: 10, label: '10°' },
                    { value: 20, label: '20°' },
                    { value: 30, label: '30°' },
                  ]}
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom>
                  Fan Speed: {zone.fanSpeed}
                </Typography>
                <Slider
                  value={zone.fanSpeed}
                  onChange={(_, value) => handleFanSpeedChange(zone.id, value as number)}
                  disabled={!zone.enabled || !masterEnabled || isUpdating}
                  min={1}
                  max={5}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 3, label: '3' },
                    { value: 5, label: '5' },
                  ]}
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom sx={{ mb: 1 }}>
                  Mode
                </Typography>
                <ToggleButtonGroup
                  value={zone.mode}
                  exclusive
                  onChange={(_, newMode) => newMode && handleModeChange(zone.id, newMode)}
                  disabled={!zone.enabled || !masterEnabled || isUpdating}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="cool">
                    <AcUnitIcon sx={{ mr: 1 }} />
                    Cool
                  </ToggleButton>
                  <ToggleButton value="heat">
                    <LocalFireDepartmentIcon sx={{ mr: 1 }} />
                    Heat
                  </ToggleButton>
                  <ToggleButton value="auto">
                    <ThermostatIcon sx={{ mr: 1 }} />
                    Auto
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      <Paper sx={{ mt: 4, p: 2, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AirIcon sx={{ mr: 2 }} />
          <Typography variant="h6">
            System Status
          </Typography>
        </Box>
<<<<<<< HEAD
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Active Zones: {zones.filter(z => z.enabled && masterEnabled).length} / {zones.length}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Avg Temperature: {Math.round(zones.reduce((acc, zone) => acc + zone.temperature, 0) / zones.length)}°C
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Power Status: {masterEnabled ? 'ON' : 'OFF'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
=======
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' }, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Active Zones: {zones.filter(z => z.enabled && masterEnabled).length} / {zones.length}
            </Typography>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' }, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Avg Temperature: {Math.round(zones.reduce((acc, zone) => acc + zone.temperature, 0) / zones.length)}°C
            </Typography>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' }, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Power Status: {masterEnabled ? 'ON' : 'OFF'}
            </Typography>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' }, minWidth: 0 }}>
>>>>>>> e647c76
            <Typography variant="body2" color="text.secondary">
              Total Fan Speed: {zones.reduce((acc, zone) => acc + (zone.enabled ? zone.fanSpeed : 0), 0)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default AC