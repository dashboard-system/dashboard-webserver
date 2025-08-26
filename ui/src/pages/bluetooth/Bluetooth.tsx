import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled'
import PhoneIcon from '@mui/icons-material/Phone'
import LaptopIcon from '@mui/icons-material/Laptop'
import HeadphonesIcon from '@mui/icons-material/Headphones'
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'

interface BluetoothDevice {
  id: string
  name: string
  type: 'phone' | 'laptop' | 'headphones' | 'unknown'
  connected: boolean
  paired: boolean
  signalStrength: number
}

function Bluetooth() {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<BluetoothDevice[]>([
    { id: '1', name: 'iPhone 13 Pro', type: 'phone', connected: true, paired: true, signalStrength: 85 },
    { id: '2', name: 'MacBook Pro', type: 'laptop', connected: false, paired: true, signalStrength: 60 },
    { id: '3', name: 'AirPods Pro', type: 'headphones', connected: false, paired: true, signalStrength: 70 },
  ])
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([
    { id: '4', name: 'Samsung Galaxy S23', type: 'phone', connected: false, paired: false, signalStrength: 90 },
    { id: '5', name: 'Dell XPS 15', type: 'laptop', connected: false, paired: false, signalStrength: 45 },
  ])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'phone': return <PhoneIcon />
      case 'laptop': return <LaptopIcon />
      case 'headphones': return <HeadphonesIcon />
      default: return <BluetoothIcon />
    }
  }

  const getSignalColor = (strength: number) => {
    if (strength >= 70) return 'success.main'
    if (strength >= 40) return 'warning.main'
    return 'error.main'
  }

  const handleConnect = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return { ...device, connected: !device.connected }
      }
      if (device.connected && device.id !== deviceId) {
        return { ...device, connected: false }
      }
      return device
    }))
  }

  const handlePair = (deviceId: string) => {
    const deviceToPair = availableDevices.find(d => d.id === deviceId)
    if (deviceToPair) {
      setDevices(prev => [...prev, { ...deviceToPair, paired: true }])
      setAvailableDevices(prev => prev.filter(d => d.id !== deviceId))
    }
  }

  const handleUnpair = (deviceId: string) => {
    const deviceToUnpair = devices.find(d => d.id === deviceId)
    if (deviceToUnpair) {
      setAvailableDevices(prev => [...prev, { ...deviceToUnpair, paired: false, connected: false }])
      setDevices(prev => prev.filter(d => d.id !== deviceId))
    }
  }

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      // Simulate finding new devices
      const newDevice: BluetoothDevice = {
        id: `${Date.now()}`,
        name: 'New Device ' + Math.floor(Math.random() * 100),
        type: 'unknown',
        connected: false,
        paired: false,
        signalStrength: Math.floor(Math.random() * 100)
      }
      setAvailableDevices(prev => [...prev, newDevice])
    }, 3000)
  }

  const connectedDevice = devices.find(d => d.connected)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Bluetooth Settings
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={bluetoothEnabled}
              onChange={() => setBluetoothEnabled(!bluetoothEnabled)}
              icon={<BluetoothDisabledIcon />}
              checkedIcon={<BluetoothIcon />}
            />
          }
          label="Bluetooth"
          sx={{ ml: 2 }}
        />
      </Box>

      {!bluetoothEnabled && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Bluetooth is disabled. Enable it to connect to devices.
        </Alert>
      )}

      {bluetoothEnabled && connectedDevice && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ConnectWithoutContactIcon sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">
                Connected to {connectedDevice.name}
              </Typography>
              <Typography variant="body2">
                Audio ready • Signal: {connectedDevice.signalStrength}%
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {/* Paired Devices */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Paired Devices
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {devices.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No paired devices
              </Typography>
            ) : (
              <List>
                {devices.map((device) => (
                  <ListItem key={device.id} divider>
                    <ListItemIcon sx={{ color: getSignalColor(device.signalStrength) }}>
                      {getDeviceIcon(device.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={device.name}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={device.connected ? 'Connected' : 'Disconnected'}
                            size="small"
                            color={device.connected ? 'success' : 'default'}
                          />
                          <Chip 
                            label={`${device.signalStrength}%`}
                            size="small"
                            sx={{ bgcolor: getSignalColor(device.signalStrength), color: 'white' }}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant={device.connected ? 'outlined' : 'contained'}
                          onClick={() => handleConnect(device.id)}
                          disabled={!bluetoothEnabled}
                        >
                          {device.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleUnpair(device.id)}
                          disabled={!bluetoothEnabled || device.connected}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Available Devices */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Available Devices
              </Typography>
              <Button
                startIcon={isScanning ? <CircularProgress size={16} /> : <RefreshIcon />}
                onClick={handleScan}
                disabled={!bluetoothEnabled || isScanning}
                size="small"
              >
                {isScanning ? 'Scanning...' : 'Scan'}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {availableDevices.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                {isScanning ? 'Scanning for devices...' : 'No devices found. Tap scan to search.'}
              </Typography>
            ) : (
              <List>
                {availableDevices.map((device) => (
                  <ListItem key={device.id} divider>
                    <ListItemIcon sx={{ color: getSignalColor(device.signalStrength) }}>
                      {getDeviceIcon(device.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={device.name}
                      secondary={
                        <Chip 
                          label={`Signal: ${device.signalStrength}%`}
                          size="small"
                          sx={{ bgcolor: getSignalColor(device.signalStrength), color: 'white', mt: 1 }}
                        />
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handlePair(device.id)}
                        disabled={!bluetoothEnabled}
                      >
                        Pair
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Bluetooth