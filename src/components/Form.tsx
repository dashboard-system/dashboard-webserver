import type {
  FormProps,
} from '../libs/constants/components_interface'
import FormInput from './FormInput'

function Form({ elementList }: FormProps) {


  console.log(elementList)

  return (
    <div>
      {elementList.map((element, index) => (
        <FormInput key={`form-${index}`} element={element}/>
      ))}
    </div>
  )
}

export default Form
