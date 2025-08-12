import { Grid, TextField, Typography } from '@mui/material'
import type { FormElementItem } from '../libs/constants/components_interface'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { setGettings } from '../store/slices/global/global-slice'
import { editTopic } from '../store/slices/uci/uci-slice'
import { getValueByPath } from '../utils/util'

function FormInput({ element }: { element: FormElementItem }) {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state)

  const handleOnChangeInput = (event: any, element: any) => {
    // Handle UCI sources
    const [stateType, fileName, sectionName] = element.source.split('/')
    if (stateType === 'uci') {
      const sourceParts = element.source.split('/')
      if (sourceParts.length >= 3) {
        const entries = state.uci[fileName]?.[sectionName] || {}
        const uuids = Object.keys(entries)

        if (uuids.length > 0) {
          const uuid = uuids[0] // Use first entry or you could make this configurable
          const currentEntry = entries[uuid] || {}
          const currentValues = currentEntry.values || {}

          dispatch(
            editTopic({
              fileName,
              sectionName,
              uuid: uuid,
              data: {
                ...currentEntry,
                values: {
                  ...currentValues,
                  [element.key]: event.target.value,
                },
              },
            }),
          )
        }
      }
    }

    // Handle specific legacy cases if needed
    switch (element.key) {
      case 'greeting':
        dispatch(setGettings(event.target.value))
        break
      default:
        break
    }
  }
  let rawValue: any
  let displayValue: string | number

  // Handle UCI sources generically
  if (element.source.startsWith('uci/')) {
    const sourceParts = element.source.split('/')
    if (sourceParts.length >= 3) {
      const fileName = sourceParts[1] // e.g., 'system'
      const sectionName = sourceParts[2] // e.g., 'system'

      const entries = state.uci[fileName]?.[sectionName] || {}
      const uuids = Object.keys(entries)
      rawValue =
        uuids.length > 0 ? entries[uuids[0]]?.values?.[element.key] : undefined
    } else {
      rawValue = undefined
    }
  } else {
    rawValue = getValueByPath(state, element.source)
  }

  if (rawValue === undefined || rawValue === null) {
    displayValue = ''
  } else if (typeof rawValue === 'object') {
    displayValue = ''
  } else if (typeof rawValue === 'string' || typeof rawValue === 'number') {
    displayValue = rawValue
  } else {
    // for safety if datatype is boolean
    displayValue = ''
  }

  const formRender = (element: FormElementItem) => {
    switch (element.type) {
      case 'textfield':
        return (
          <TextField
            key={element.key}
            // label={element.label}
            fullWidth
            margin="normal"
            value={displayValue}
            sx={{ maxWidth: '400px' }}
            onChange={(ev) => handleOnChangeInput(ev, element)}
          />
        )
      default:
        return null
    }
  }
  return (
    <Grid container alignItems="center">
      <Grid size={{ xs: 12, md: 2 }}>
        <Typography align="center">{element.label}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>{formRender(element)}</Grid>
    </Grid>
  )
}

export default FormInput
