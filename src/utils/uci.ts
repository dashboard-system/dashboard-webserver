// src/utils/uci.ts
export class UCIManager {
  private baseURL: string
  private timeout: number

  constructor(mqttServerUrl: string = process.env.MQTT_SERVER_URL || 'http://localhost:3001') {
    this.baseURL = `${mqttServerUrl}/api/uci`
    this.timeout = 10000
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async listFiles(): Promise<string[]> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/files`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data || []
    } catch (error) {
      console.error('Error listing UCI files from MQTT server:', error)
      throw new Error('Failed to list UCI files from MQTT server')
    }
  }

  async getFileSections(fileName: string): Promise<any[]> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/files/${fileName}`)
      if (response.status === 404) {
        throw new Error(`UCI file '${fileName}' not found`)
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data || []
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error
      }
      console.error(`Error reading UCI file ${fileName} from MQTT server:`, error)
      throw new Error(`Failed to read UCI file '${fileName}' from MQTT server`)
    }
  }

  async getSectionsByType(fileName: string, sectionType: string): Promise<any[]> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/files/${fileName}/${sectionType}`)
      if (response.status === 404) {
        throw new Error(`Sections of type '${sectionType}' not found in file '${fileName}'`)
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data || []
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error
      }
      console.error(`Error getting sections of type ${sectionType} from MQTT server:`, error)
      throw new Error(`Failed to get sections of type '${sectionType}' from MQTT server`)
    }
  }

  async getSection(fileName: string, sectionType: string, uuid: string): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/files/${fileName}/${sectionType}/${uuid}`)
      if (response.status === 404) {
        throw new Error(`Section with UUID '${uuid}' not found`)
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error
      }
      console.error(`Error getting section ${uuid} from MQTT server:`, error)
      throw new Error(`Failed to get section '${uuid}' from MQTT server`)
    }
  }

  async createSection(fileName: string, sectionType: string, name?: string, values?: Record<string, string | string[] | number>): Promise<string> {
    try {
      const payload: any = {}
      if (values) payload.values = values

      const response = await this.fetchWithTimeout(`${this.baseURL}/files/${fileName}/${sectionType}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data.uuid || data.id
    } catch (error) {
      console.error(`Error creating section in ${fileName} on MQTT server:`, error)
      throw new Error(`Failed to create section in '${fileName}' on MQTT server`)
    }
  }

  async updateSection(fileName: string, sectionType: string, uuid: string, values: Record<string, string | string[] | number>): Promise<void> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/files/${fileName}/${sectionType}/${uuid}`, {
        method: 'PUT',
        body: JSON.stringify({ values })
      })
      
      if (response.status === 404) {
        throw new Error(`Section with UUID '${uuid}' not found`)
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error
      }
      console.error(`Error updating section ${uuid} on MQTT server:`, error)
      throw new Error(`Failed to update section '${uuid}' on MQTT server`)
    }
  }

  async deleteSection(fileName: string, sectionType: string, uuid: string): Promise<void> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/files/${fileName}/${sectionType}/${uuid}`, {
        method: 'DELETE'
      })
      
      if (response.status === 404) {
        throw new Error(`Section with UUID '${uuid}' not found`)
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error
      }
      console.error(`Error deleting section ${uuid} on MQTT server:`, error)
      throw new Error(`Failed to delete section '${uuid}' on MQTT server`)
    }
  }

  async reloadFile(fileName: string): Promise<void> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/reload/${fileName}`, {
        method: 'POST'
      })
      
      if (response.status === 404) {
        throw new Error(`UCI file '${fileName}' not found`)
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error
      }
      console.error(`Error reloading UCI file ${fileName} on MQTT server:`, error)
      throw new Error(`Failed to reload UCI file '${fileName}' on MQTT server`)
    }
  }
}