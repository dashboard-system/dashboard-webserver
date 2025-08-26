import Page from '../../components/Page'
import { settingFormElementList } from '../../libs/constants/settings_const'
import Form from '../../components/Form'
import { 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Divider 
} from '@mui/material'
import { useAppSelector, useAppDispatch } from '../../store/hook'
import { useUpdateUCIEntryMutation } from '../../store/slices/uci/uci-api-slice'
import { errorMessage, successMessage } from '../../utils/message'
import { setTheme } from '../../store/slices/global/global-slice'
import type { ThemeMode } from '../../theme/NewDashboardTheme'

interface Props {
  componentName: string
}

function Settings({ componentName }: Props) {
  const uciState = useAppSelector((state) => state.uci)
  const currentTheme = useAppSelector((state) => state.global.pageStatus.theme)
  const dispatch = useAppDispatch()
  const [updateUCIEntry, { isLoading }] = useUpdateUCIEntryMutation()

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.value as ThemeMode
    dispatch(setTheme(newTheme))
  }

  const handleSaveAndApply = async () => {
    try {
      // Collect all unique UCI sources from form elements
      const uciSources = new Set<string>()
      settingFormElementList.forEach((element) => {
        if (element.source.startsWith('uci/')) {
          uciSources.add(element.source)
        }
      })

      if (uciSources.size === 0) {
        errorMessage('No UCI configuration found to save')
        return
      }

      // Process each unique UCI source
      const promises = Array.from(uciSources).map(async (source) => {
        const sourceParts = source.split('/')
        if (sourceParts.length >= 3) {
          const fileName = sourceParts[1]
          const sectionName = sourceParts[2]

          const entries = uciState[fileName]?.[sectionName] || {}
          const uuids = Object.keys(entries)

          if (uuids.length > 0) {
            const uuid = uuids[0]
            const entry = entries[uuid]

            return updateUCIEntry({
              uuid: uuid,
              sectionType: sectionName,
              sectionName: entry.sectionName || sectionName,
              fileName: fileName,
              values: entry.values || {},
              lastModified: new Date().toISOString(),
            }).unwrap()
          }
        }
        return null
      })

      const results = await Promise.all(promises)
      const successful = results.filter((r) => r !== null).length

      if (successful > 0) {
        successMessage(`Successfully saved ${successful} configuration(s)!`)
      } else {
        errorMessage('No configurations were saved')
      }
    } catch (error: any) {
      console.error('Failed to save UCI config:', error)
      errorMessage(
        error.data?.message ||
        error.message ||
        'Failed to save configuration'
      )
    }
  }

  return (
    <Page title={componentName}>
      {/* Theme Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose how the dashboard looks and feels
          </Typography>
          
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Theme Mode
            </FormLabel>
            <RadioGroup
              value={currentTheme}
              onChange={handleThemeChange}
              row
            >
              <FormControlLabel
                value="system"
                control={<Radio />}
                label="System"
                sx={{ mr: 3 }}
              />
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light"
                sx={{ mr: 3 }}
              />
              <FormControlLabel
                value="dark"
                control={<Radio />}
                label="Dark"
              />
            </RadioGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              System: Follow your device's theme setting.
            </Typography>
          </FormControl>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* UCI Configuration Settings */}
      <Typography variant="h6" gutterBottom>
        System Configuration
      </Typography>
      <Form elementList={settingFormElementList} />

      <Box sx={{ 
        mt: 3, 
        mb: 4, 
        px: { xs: 2, sm: 0 }, 
        display: 'flex', 
        gap: 2, 
        justifyContent: { xs: 'center', sm: 'flex-end' },
        maxWidth: { sm: '600px' },
        width: '100%'
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAndApply}
          disabled={isLoading}
          sx={{ minWidth: '120px', width: { xs: '200px', sm: 'auto' } }}
        >
          {isLoading ? 'Saving...' : 'Save & Apply'}
        </Button>
      </Box>
    </Page>
  )
}

export default Settings
