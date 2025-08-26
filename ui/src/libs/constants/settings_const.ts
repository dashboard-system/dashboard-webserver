import type { ElementList } from './components_interface'

const settingFormElementList: ElementList = [
  {
    key: 'greeting',
    label: 'Greeting Text',
    type: 'textfield',
    source: 'uci/system/system',
  },
  {
    key: 'hostname',
    label: 'Hostname',
    type: 'textfield',
    source: 'uci/system/system',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textfield',
    source: 'uci/system/system',
  },
]

export { settingFormElementList }
