import { Grid, TextField, Typography } from '@mui/material'
import type { FormElementItem } from '../libs/constants/components_interface'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { setGettings } from '../store/slices/global/global-slice'

function FormInput({ element }: { element: FormElementItem }) {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state)
  const handleOnChangeInput = (event: any, element: any) => {
    console.log(element.key)
    console.log(event.target.value)

    switch (element.key) {
      case 'greetings':
        console.log(123)

        dispatch(setGettings(event.target.value))
        break

      default:
        break
    }
  }
  const valueRender = (source: string) => {
    if (!source) {
      return ''
    }
    const parts = source.split('/')
    let currentValue: any = state
    for (const part of parts) {
      if (
        currentValue &&
        typeof currentValue === 'object' &&
        part in currentValue
      ) {
        // safe get into
        currentValue = currentValue[part]
      } else {
        console.error(`Error: Invalid path "${source}" at part "${part}"`)
        return ''
      }
    }
    if (typeof currentValue === 'object') {
      return ''
    }

    return currentValue
  }

  const formRender = (element: FormElementItem) => {
    switch (element.type) {
      case 'textfield':
        return (
          <TextField
            key={element.key}
            label={element.label}
            fullWidth
            margin="normal"
            value={valueRender(element.source)}
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
