import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'

interface LightControl {
  id: string
  name: string
  brightness: number
  enabled: boolean
  uuid: string
}

interface LightCardProps {
  light: LightControl
  isUpdating?: boolean
  onToggle: (id: string) => void
  onBrightnessChange: (id: string, value: number) => void
}

function LightCard({ light, isUpdating = false, onToggle, onBrightnessChange }: LightCardProps) {
  return (
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
                onChange={() => onToggle(light.id)}
                disabled={isUpdating}
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
          onChange={(_, value) => onBrightnessChange(light.id, value as number)}
          disabled={!light.enabled || isUpdating}
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
  )
}

export default LightCard