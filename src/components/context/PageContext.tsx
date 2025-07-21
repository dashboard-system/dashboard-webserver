import { createContext, type ReactNode, useEffect, useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { MqttManager } from '../../utils/mqtt/mqtt'
import { handleMqttMessage, MqttPayload } from '../../utils/mqtt/handleMqttMessage'

export type PageContextType = {
  isLogin: boolean
  mqttManager: MqttManager | null
}

const PageContext = createContext<PageContextType | null>(null)
const mqttOptions = {
  url: 'ws://localhost:8883/mqtt',
  options: {
    clientId: `dashboard-${Date.now()}`,
    clean: true,
    reconnectPeriod: 1000,
    username: import.meta.env.VITE_APP_MQTT_USERNAME || 'admin',
    password: import.meta.env.VITE_APP_MQTT_PASSWORD || 'admin123',
  },
}
const PageContextProvider = ({ children }: { children: ReactNode }) => {
  const { mode, setMode } = useColorScheme()
  const isLogin = useAppSelector((state) => state.global.pageStatus.isLogin)
  const [mqttManager, setMqttManager] = useState<MqttManager>(new MqttManager())
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initMqtt = async () => {
      try {
        await mqttManager.connect(mqttOptions)
        mqttManager.subscribeToTopics(['system/#', 'config/#'])
        mqttManager.addMessageHandler('default', (topic, message) => {
          const [type, fileName, sectionName, uuid] = topic.split('/')
          const payload: MqttPayload = {
            topic,
            type,
            fileName,
            sectionName,
            uuid,
            message,
          }
          handleMqttMessage(dispatch, payload)
        })
      } catch (error) {
        console.error('Failed to connect to MQTT:', error)
      }
    }

    initMqtt()

    return () => {
      if (mqttManager) {
        mqttManager.disconnect()
      }
    }
  }, [])

  return (
    <PageContext.Provider value={{ isLogin, mqttManager }}>
      {children}
    </PageContext.Provider>
  )
}

export { PageContext, PageContextProvider }
