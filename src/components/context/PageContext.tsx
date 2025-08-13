import { createContext, type ReactNode, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { MqttManager } from '../../utils/mqtt/mqtt'
import {
  handleMqttMessage,
  MqttPayload,
} from '../../utils/mqtt/handleMqttMessage'
import { useLocation } from 'react-router-dom'
import { setCurrentPage } from '../../store/slices/global/global-slice'

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
  const [mqttManager] = useState<MqttManager>(new MqttManager())
  const dispatch = useAppDispatch()
  const location = useLocation()
  const isLogin = useAppSelector((state) => state.global.pageStatus.isLogin)
  const pageList = useAppSelector((state) => state.global.pageList)
  const state = useAppSelector((state) => state)
  console.log(state);
  
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
  }, [dispatch, mqttManager])

  useEffect(() => {
    // Find the matching page based on current pathname
    const currentPageItem = pageList.find(
      (page) => page.path === location.pathname,
    )
    if (currentPageItem) {
      dispatch(setCurrentPage(currentPageItem.componentName))
    } else {
      // Default to landing if no match found and we're at root
      if (location.pathname === '/') {
        dispatch(setCurrentPage('landing'))
      }
    }
  }, [location.pathname, pageList, dispatch])

  return (
    <PageContext.Provider value={{ isLogin, mqttManager }}>
      {children}
    </PageContext.Provider>
  )
}

export { PageContext, PageContextProvider }
