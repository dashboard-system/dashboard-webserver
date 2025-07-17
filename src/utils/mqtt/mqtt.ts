import mqtt, { MqttClient } from 'mqtt'

export interface MqttConfig {
  url: string
  options?: mqtt.IClientOptions
}

export class MqttManager {
  private client: MqttClient | null = null
  private config: MqttConfig | null = null
  private messageHandlers: Map<string, (topic: string, message: Buffer) => void> = new Map()

  connect(config: MqttConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.config = config
      
      this.client = mqtt.connect(config.url, config.options)
      
      this.client.on('connect', () => {
        console.log('MQTT connected')
        resolve()
      })
      
      this.client.on('error', (error) => {
        console.error('MQTT connection error:', error)
        reject(error)
      })
      
      this.client.on('close', () => {
        console.log('MQTT connection closed')
      })

      this.client.on('message', (topic: string, message: Buffer) => {
        this.onMessageReceived(topic, message)
      })
    })
  }

  disconnect(): void {
    if (this.client) {
      this.client.end()
      this.client = null
    }
    this.messageHandlers.clear()
  }

  private onMessageReceived(topic: string, message: Buffer): void {
    console.log(`Received message on topic ${topic}:`, message.toString())
    
    // Call all registered handlers
    this.messageHandlers.forEach((handler, handlerKey) => {
      handler(topic, message)
    })
  }

  addMessageHandler(key: string, handler: (topic: string, message: Buffer) => void): void {
    this.messageHandlers.set(key, handler)
  }

  removeMessageHandler(key: string): void {
    this.messageHandlers.delete(key)
  }

  subscribe(topic: string, handlerKey?: string): void {
    if (!this.client) {
      throw new Error('MQTT client not connected')
    }
    
    this.client.subscribe(topic, (error) => {
      if (error) {
        console.error('MQTT subscribe error:', error)
        return
      }
      console.log(`Subscribed to topic: ${topic}`)
    })
  }

  subscribeToTopics(topics: string[]): void {
    if (!this.client) {
      throw new Error('MQTT client not connected')
    }
    
    topics.forEach(topic => {
      this.client!.subscribe(topic, (error) => {
        if (error) {
          console.error(`MQTT subscribe error for topic ${topic}:`, error)
          return
        }
        console.log(`Subscribed to topic: ${topic}`)
      })
    })
  }

  publish(topic: string, message: string): void {
    if (!this.client) {
      throw new Error('MQTT client not connected')
    }
    
    this.client.publish(topic, message, (error) => {
      if (error) {
        console.error('MQTT publish error:', error)
        return
      }
      console.log(`Published to topic: ${topic}`)
    })
  }

  isConnected(): boolean {
    return this.client?.connected || false
  }
}

export const mqttManager = new MqttManager()