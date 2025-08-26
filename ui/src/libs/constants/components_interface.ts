interface FormElementItem {
  key: string
  label: string
  type: string
  source: string
}

type ElementList = FormElementItem[]

interface FormProps {
  elementList: ElementList
}

export type { FormElementItem, FormProps, ElementList }
