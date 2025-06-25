import React, { useState } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Link,
  Box,
  Alert,
} from '@mui/material'
import { fetchPost } from '../utils/fetch'
import { successMessage } from '../utils/message'
import { useAppDispatch } from '../store/hook'
import { setIsLogin } from '../store/slices/global/global-slice'

// Import validation functions
import {
  validateLoginForm,
  validateLoginField,
  prepareLoginData,
  type LoginFormData,
  type FormValidationErrors
} from '../utils/validation'

interface LoginProps {
  open: boolean
  toggleLogin: () => void
}

const LoginDialog: React.FC<LoginProps> = ({ open, toggleLogin }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    username: '',
    password: '',
  })
  const [error, setError] = useState<string>('') // General error state
  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({}) // Field-specific errors
  const [isLoading, setIsLoading] = useState(false)

  const handleOnChangeFormInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = ev.target
    setError('') // Clear general error when user starts typing
    
    // Real-time field validation
    const fieldValidation = validateLoginField(id as keyof LoginFormData, value)
    
    // Update field-specific validation errors
    setValidationErrors(prev => ({
      ...prev,
      [id]: fieldValidation.isValid ? undefined : fieldValidation.error
    }))
    
    setLoginForm((obj) => ({ ...obj, [id]: value }))
  }

  const onClickLoginHandler = async (
    ev: React.MouseEvent<HTMLButtonElement>,
  ) => {
    ev.preventDefault()
    setError('') // Clear previous errors
    
    // Validate entire form before submission
    const validation = validateLoginForm(loginForm)
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors as FormValidationErrors)
      return // Stop submission if validation fails
    }
    
    setIsLoading(true)

    try {
      // Prepare and sanitize data for submission
      const preparedData = prepareLoginData(loginForm)
      
      const resp = await fetchPost({ url: '/api/auth/login', data: preparedData })
      const result = await resp.json()

      if (result.error) {
        throw new Error(result.error)
      }

      // Success - handle login
      successMessage('Login Success!')
      dispatch(setIsLogin(true))
      
      // Reset form on success
      setLoginForm({ username: '', password: '' })
      setValidationErrors({})
      
      toggleLogin() // Close dialog on success
    } catch (error) {
      console.error('Login Request:', error)
      // Set user-friendly error message
      setError(
        error instanceof Error
          ? error.message
          : 'Login failed. Please check your credentials and try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press for better UX
  const handleKeyPress = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter' && !isLoading && isFormValid()) {
      onClickLoginHandler(ev as any)
    }
  }

  // Check if form is valid for button state
  const isFormValid = () => {
    const hasContent = loginForm.username.trim() && loginForm.password
    const hasNoValidationErrors = Object.values(validationErrors).every(error => !error)
    return hasContent && hasNoValidationErrors
  }

  // Reset form helper
  const resetForm = () => {
    setLoginForm({ username: '', password: '' })
    setValidationErrors({})
    setError('')
  }

  return (
    <Dialog open={open} onClose={toggleLogin} fullScreen={fullScreen}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your username and password to log in.
        </DialogContentText>

        {/* General Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          placeholder="Enter your username"
          type="text"
          fullWidth
          variant="outlined"
          value={loginForm.username}
          onChange={handleOnChangeFormInput}
          onKeyPress={handleKeyPress}
          error={!!validationErrors.username} // Show error for this specific field
          helperText={validationErrors.username} // Show field-specific error message
          disabled={isLoading}
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          fullWidth
          variant="outlined"
          value={loginForm.password}
          onChange={handleOnChangeFormInput}
          onKeyPress={handleKeyPress}
          error={!!validationErrors.password} // Show error for this specific field
          helperText={validationErrors.password} // Show field-specific error message
          disabled={isLoading}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={onClickLoginHandler}
          disabled={isLoading || !isFormValid()} // Disable if loading or form invalid
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        <Box textAlign="center" mt={1}>
          <Link
            href="#"
            variant="body2"
            onClick={(e) => {
              e.preventDefault()
              resetForm() // Reset form when canceling
              toggleLogin()
            }}
          >
            Cancel
          </Link>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog