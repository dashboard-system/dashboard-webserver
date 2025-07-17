import { AppDispatch } from '../../store/store'
import { addStatusTopic } from '../../store/slices/status/status-slice'
import { addTopic } from '../../store/slices/uci/uci-slice'

export interface MqttPayload {
  type: string
  fileName: string
  sectionName: string
  uuid: string
  message: Buffer
}

export const handleMqttMessage = (
  dispatch: AppDispatch,
  payload: MqttPayload,
) => {
  const messageString = payload.message.toString()

  const parsedMessage = JSON.parse(messageString)

  switch (payload.type) {
    case 'config':
      dispatch(
        addTopic({
          fileName: payload.fileName,
          sectionName: payload.sectionName,
          uuid: payload.uuid,
          message: parsedMessage,
        }),
      )
      break
    case 'system':
      dispatch(
        addStatusTopic({
          topic: `${payload.type}/${payload.fileName}/${payload.sectionName}/${payload.uuid}`,
          message: parsedMessage,
        }),
      )
      break
    default:
      console.log(`Unknown message type: ${payload.type}`)
      break
  }
}
