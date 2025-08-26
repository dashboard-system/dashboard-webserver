import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { errorMessage } from '../../../utils/message'

interface UCIUpdateRequest {
  uuid: string
  sectionType: string
  sectionName: string
  fileName: string
  values: Record<string, unknown>
  lastModified?: string
}

interface UCIUpdateResponse {
  success: boolean
  message: string
  data?: object
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
    responseHandler: async (response) => {
      if (response.status === 403) {
        errorMessage(
          'Access denied: You do not have permission to perform this action',
        )
      }
      return response.json()
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
