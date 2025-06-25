import { Grid, TextField, Typography } from '@mui/material'
import type { FormElementItem } from '../libs/constants/components_interface'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { setGettings } from '../store/slices/global/global-slice'
import { getValueByPath } from '../utils/util'

function FormInput({ element }: { element: FormElementItem }) {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state)
  const handleOnChangeInput = (event: any, element: any) => {
    console.log(element.key)
    console.log(event.target.value)

    switch (element.key) {
      case 'greetings':
        dispatch(setGettings(event.target.value))
        break
      default:
        break
    }
  }
  const rawValue = getValueByPath(state, element.source)
  let displayValue: string | number

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
            label={element.label}
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
