import Page from '../../components/Page'
import { settingFormElementList } from '../../libs/constants/settings_const'
import Form from '../../components/Form'

interface Props {
  componentName: string
}

function Settings({ componentName }: Props) {
  return (
    <Page title={componentName}>
      <Form elementList={settingFormElementList} />
    </Page>
  )
}

export default Settings
