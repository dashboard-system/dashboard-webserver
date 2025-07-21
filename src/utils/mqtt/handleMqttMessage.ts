import { AppDispatch } from '../../store/store'
import { addStatusTopic } from '../../store/slices/status/status-slice'
import { addTopic } from '../../store/slices/uci/uci-slice'

export interface MqttPayload {
  type: string
  fileName: string
  sectionName: string
  uuid: string
  topic: string
  message: any
}

export const handleMqttMessage = (
  dispatch: AppDispatch,
  payload: MqttPayload,
) => {
  switch (payload.type) {
    case 'config':
      dispatch(addTopic(payload))
      break
    case 'system':
      dispatch(addStatusTopic(payload))
      break
    default:
      console.log(`Unknown message type: ${payload.type}`)
      break
  }
}
