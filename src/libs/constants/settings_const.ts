import type { ElementList, FormElementItem } from './components_interface'

const settingFormElementList: ElementList = [
  {
    key: 'greetings',
    label: 'Greeting Text',
    type: 'textfield',
    source: 'global/greetings',
  },
]

function FormInput({ element }: { element: FormElementItem }) {
  // component implementation
}

export { settingFormElementList }
