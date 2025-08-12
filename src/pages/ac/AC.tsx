import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Grid,
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

interface ACZone {
  id: string
  name: string
  temperature: number
  targetTemp: number
  enabled: boolean
  mode: 'cool' | 'heat' | 'auto'
  fanSpeed: number
}

function AC() {
  const [zones, setZones] = useState<ACZone[]>([
    { id: 'cockpit', name: 'Cockpit', temperature: 22, targetTemp: 21, enabled: true, mode: 'cool', fanSpeed: 3 },
    { id: 'cabin', name: 'Cabin', temperature: 24, targetTemp: 23, enabled: true, mode: 'cool', fanSpeed: 2 },
    { id: 'cargo', name: 'Cargo Hold', temperature: 18, targetTemp: 15, enabled: false, mode: 'auto', fanSpeed: 1 },
  ])

  const [masterEnabled, setMasterEnabled] = useState(true)

  const handleTargetTempChange = (id: string, value: number) => {
    setZones(prev => prev.map(zone => 
      zone.id === id ? { ...zone, targetTemp: value } : zone
    ))
  }

  const handleFanSpeedChange = (id: string, value: number) => {
    setZones(prev => prev.map(zone => 
      zone.id === id ? { ...zone, fanSpeed: value } : zone
    ))
  }

  const handleToggle = (id: string) => {
    setZones(prev => prev.map(zone => 
      zone.id === id ? { ...zone, enabled: !zone.enabled } : zone
    ))
  }

  const handleModeChange = (id: string, mode: 'cool' | 'heat' | 'auto') => {
    setZones(prev => prev.map(zone => 
      zone.id === id ? { ...zone, mode } : zone
    ))
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
      
      <Grid container spacing={3}>
        {zones.map((zone) => (
          <Grid item xs={12} lg={4} key={zone.id}>
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
                        disabled={!masterEnabled}
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
                  disabled={!zone.enabled || !masterEnabled}
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
                  disabled={!zone.enabled || !masterEnabled}
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
                  disabled={!zone.enabled || !masterEnabled}
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
          </Grid>
        ))}
      </Grid>
      
      <Paper sx={{ mt: 4, p: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AirIcon sx={{ mr: 2 }} />
          <Typography variant="h6">
            System Status
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Active Zones: {zones.filter(z => z.enabled && masterEnabled).length} / {zones.length}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Avg Temperature: {Math.round(zones.reduce((acc, zone) => acc + zone.temperature, 0) / zones.length)}°C
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Power Status: {masterEnabled ? 'ON' : 'OFF'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total Fan Speed: {zones.reduce((acc, zone) => acc + (zone.enabled ? zone.fanSpeed : 0), 0)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default AC