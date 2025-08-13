import { Paper, Typography } from '@mui/material'

interface LightControl {
  id: string
  name: string
  brightness: number
  enabled: boolean
  uuid: string
}

interface LightSystemStatusProps {
  lights: LightControl[]
}

function LightSystemStatus({ lights }: LightSystemStatusProps) {
  const activeLights = lights.filter((l) => l.enabled)
  const averageBrightness = Math.round(
    lights.reduce(
      (acc, light) => acc + (light.enabled ? light.brightness : 0),
      0,
    ) / activeLights.length || 0,
  )

  return (
    <Paper sx={{ mt: 4, p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        System Status
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Total Active Lights: {activeLights.length} / {lights.length}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Average Brightness: {averageBrightness}%
      </Typography>
    </Paper>
  )
}

export default LightSystemStatus