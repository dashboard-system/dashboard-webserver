import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface UCIUpdateRequest {
  uuid: string
  sectionType: string
  sectionName: string
  fileName: string
  values: Record<string, any>
  lastModified?: string
}

interface UCIUpdateResponse {
  success: boolean
  message: string
  data?: any
}

export const uciApiSlice = createApi({
  reducerPath: 'uciApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_WEB_SERVER + '/api',
    prepareHeaders(headers) {
      headers.set('Content-Type', 'application/json')
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  endpoints(builder) {
    return {
      updateUCIEntry: builder.mutation<UCIUpdateResponse, UCIUpdateRequest>({
        query({ fileName, sectionType, uuid, ...body }) {
          return {
            url: `/uci/files/${fileName}/${sectionType}/${uuid}`,
            method: 'PUT',
            body,
          }
        },
      }),
    }
  },
})

export const { useUpdateUCIEntryMutation } = uciApiSlice
