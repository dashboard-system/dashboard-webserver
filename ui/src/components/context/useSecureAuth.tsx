import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { setToken, setIsLogin } from '../../store/slices/global/global-slice'
import { useRefreshTokenMutation } from '../../store/slices/auth/auth-api-slice'

// Secure authentication provider with automatic refresh
const useSecureAuth = () => {
  const dispatch = useAppDispatch()
  const [refreshTokenMutation] = useRefreshTokenMutation()
  const { token, isLogin } = useAppSelector((state) => ({
    token: state.global.auth.token,
    isLogin: state.global.pageStatus.isLogin,
  }))
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    // Check Redux state first
    if (isLogin && token) {
      return true
    }

    // Check localStorage as fallback
    const storedToken = localStorage.getItem('token')
    return !!storedToken
  }

  // Refresh tokens function
  const refreshTokens = async () => {
    try {
      const result = await refreshTokenMutation().unwrap()

      if (result.message && result.token) {
        const newToken = result.token

        // Update Redux state
        dispatch(setToken(newToken))
        dispatch(setIsLogin(true))

        // Update localStorage
        localStorage.setItem('token', newToken)

        return newToken
      } else {
        // Refresh failed, logout user
        logout()
        return null
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return null
    }
  }

  // Logout function
  const logout = () => {
    dispatch(setToken(null))
    dispatch(setIsLogin(false))
    localStorage.removeItem('token')
  }

  // Login function
  const login = (token: string) => {
    dispatch(setToken(token))
    dispatch(setIsLogin(true))
    localStorage.setItem('token', token)
  }

  // Initialize authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if token exists in localStorage
        const storedToken = localStorage.getItem('token')

        if (storedToken) {
          // Update Redux state with stored token
          dispatch(setToken(storedToken))
          dispatch(setIsLogin(true))

          // Try to refresh the token to ensure it's still valid
          await refreshTokens()
        } else {
          // Try to get token from refresh endpoint
          try {
            const result = await refreshTokenMutation().unwrap()
            
            if (result.message && result.token) {
              const newToken = result.token

              // Store new token
              dispatch(setToken(newToken))
              dispatch(setIsLogin(true))
              localStorage.setItem('token', newToken)
            }
          } catch (refreshError) {
            // Refresh failed, user needs to login
            console.log('No valid refresh token available')
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // User needs to login
        logout()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [dispatch])

  // Automatic token refresh before expiration
  useEffect(() => {
    if (isAuthenticated()) {
      const refreshInterval = setInterval(refreshTokens, 14 * 60 * 1000) // 14 minutes
      return () => clearInterval(refreshInterval)
    }
  }, [token])

  return {
    isAuthenticated: isAuthenticated(),
    loading,
    token,
    login,
    logout,
    refreshTokens,
  }
}

export default useSecureAuth
