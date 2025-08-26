import type {
  FormProps,
} from '../libs/constants/components_interface'
import FormInput from './FormInput'
import { Box } from '@mui/material'

function Form({ elementList }: FormProps) {
  console.log(elementList)

  return (
    <Box>
      {elementList.map((element, index) => (
        <FormInput key={`form-${index}`} element={element}/>
      ))}
    </Box>
  )
}

export default Form
