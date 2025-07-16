// src/types/uci.ts
export interface UCISection {
  uuid: string
  type: string
  name?: string
  options: Record<string, string | string[] | number>
}

export interface UCIFile {
  fileName: string
  sections: UCISection[]
}

export interface UCICreateRequest {
  name?: string
  values?: Record<string, string | string[] | number>
}

export interface UCIUpdateRequest {
  uuid: string
  sectionType: string
  sectionName: string
  fileName: string
  values: Record<string, string | string[] | number>
}

export interface UCIResponse {
  success: boolean
  message?: string
  data?: any
}