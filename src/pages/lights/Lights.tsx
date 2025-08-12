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
} from '@mui/material'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'

interface LightControl {
  id: string
  name: string
  brightness: number
  enabled: boolean
}

function Lights() {
  const [lights, setLights] = useState<LightControl[]>([
    { id: 'cockpit', name: 'Cockpit Lights', brightness: 75, enabled: true },
    { id: 'cabin', name: 'Cabin Lights', brightness: 50, enabled: true },
    { id: 'exterior', name: 'Exterior Lights', brightness: 100, enabled: false },
    { id: 'instrument', name: 'Instrument Panel', brightness: 80, enabled: true },
    { id: 'reading', name: 'Reading Lights', brightness: 30, enabled: false },
  ])

  const handleBrightnessChange = (id: string, value: number) => {
    setLights(prev => prev.map(light => 
      light.id === id ? { ...light, brightness: value } : light
    ))
  }

  const handleToggle = (id: string) => {
    setLights(prev => prev.map(light => 
      light.id === id ? { ...light, enabled: !light.enabled } : light
    ))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Lighting Controls
      </Typography>
      
      <Grid container spacing={3}>
        {lights.map((light) => (
          <Grid item xs={12} md={6} key={light.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {light.enabled ? (
                    <LightbulbIcon sx={{ mr: 2, color: 'warning.main' }} />
                  ) : (
                    <LightbulbOutlinedIcon sx={{ mr: 2, color: 'grey.400' }} />
                  )}
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {light.name}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={light.enabled}
                        onChange={() => handleToggle(light.id)}
                      />
                    }
                    label=""
                    sx={{ m: 0 }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography gutterBottom>
                  Brightness: {light.brightness}%
                </Typography>
                <Slider
                  value={light.brightness}
                  onChange={(_, value) => handleBrightnessChange(light.id, value as number)}
                  disabled={!light.enabled}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' },
                  ]}
                  sx={{
                    color: light.enabled ? 'warning.main' : 'grey.400',
                    '& .MuiSlider-thumb': {
                      backgroundColor: light.enabled ? 'warning.main' : 'grey.400',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Paper sx={{ mt: 4, p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          System Status
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Active Lights: {lights.filter(l => l.enabled).length} / {lights.length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Average Brightness: {Math.round(lights.reduce((acc, light) => acc + (light.enabled ? light.brightness : 0), 0) / lights.filter(l => l.enabled).length || 0)}%
        </Typography>
      </Paper>
    </Box>
  )
}

export default Lights