import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { errorMessage } from '../../../utils/message'

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  token: string
  message?: string
  user?: {
    id: string
    username: string
    email?: string
  }
}

interface RefreshTokenResponse {
  token: string
  message?: string
}

interface LogoutResponse {
  success: boolean
  message: string
}

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_WEB_SERVER + '/api/auth',
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
      login: builder.mutation<LoginResponse, LoginRequest>({
        query(credentials) {
          return {
            url: '/login',
            method: 'POST',
            body: credentials,
          }
        },
      }),
      refreshToken: builder.mutation<RefreshTokenResponse, void>({
        query() {
          return {
            url: '/refresh',
            method: 'POST',
          }
        },
      }),
      logout: builder.mutation<LogoutResponse, void>({
        query() {
          return {
            url: '/logout',
            method: 'POST',
          }
        },
      }),
    }
  },
})

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } =
  authApiSlice
