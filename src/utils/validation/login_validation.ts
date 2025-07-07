import { 
  validateField, 
  validateForm, 
  sanitizeInput,
  type ValidationResult, 
  type FormValidationResult,
  VALIDATION_CONFIGS,
  ERROR_MESSAGES 
} from './validation'

// =============================================================================
// TYPES
// =============================================================================

export interface LoginFormData {
  username: string
  password: string
}

export interface RegistrationFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted?: boolean
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  password: string
  confirmPassword: string
  token: string
}

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// =============================================================================
// INDIVIDUAL FIELD VALIDATORS
// =============================================================================

/**
 * Validates username field
 */
export const validateUsername = (username: string): ValidationResult => {
  const sanitized = sanitizeInput(username)
  return validateField(sanitized, VALIDATION_CONFIGS.username, 'Username')
}

/**
 * Validates password field
 */
export const validatePassword = (password: string): ValidationResult => {
  return validateField(password, VALIDATION_CONFIGS.password, 'Password')
}

/**
 * Validates strong password with additional requirements
 */
export const validateStrongPassword = (password: string): ValidationResult => {
  return validateField(password, VALIDATION_CONFIGS.strongPassword, 'Password')
}

/**
 * Validates email field
 */
export const validateEmail = (email: string): ValidationResult => {
  const sanitized = sanitizeInput(email.toLowerCase())
  return validateField(sanitized, VALIDATION_CONFIGS.email, 'Email')
}

/**
 * Validates password confirmation
 */
export const validatePasswordConfirmation = (
  password: string, 
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { 
      isValid: false, 
      error: 'Please confirm your password' 
    }
  }
  
  if (password !== confirmPassword) {
    return { 
      isValid: false, 
      error: ERROR_MESSAGES.password.mismatch 
    }
  }
  
  return { isValid: true }
}

/**
 * Validates terms acceptance
 */
export const validateTermsAcceptance = (accepted: boolean): ValidationResult => {
  if (!accepted) {
    return { 
      isValid: false, 
      error: 'You must accept the terms and conditions' 
    }
  }
  
  return { isValid: true }
}

// =============================================================================
// FORM VALIDATORS
// =============================================================================

/**
 * Validates login form
 */
export const validateLoginForm = (formData: LoginFormData): FormValidationResult<LoginFormData> => {
  const sanitizedData = {
    username: sanitizeInput(formData.username),
    password: formData.password // Don't sanitize password
  }
  
  return validateForm(
    sanitizedData,
    {
      username: VALIDATION_CONFIGS.username,
      password: VALIDATION_CONFIGS.password
    },
    {
      username: 'Username',
      password: 'Password'
    }
  )
}

/**
 * Validates registration form
 */
export const validateRegistrationForm = (formData: RegistrationFormData): FormValidationResult<RegistrationFormData> => {
  const errors: Partial<Record<keyof RegistrationFormData, string>> = {}
  
  // Validate individual fields
  const usernameValidation = validateUsername(formData.username)
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error
  }
  
  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }
  
  const passwordValidation = validateStrongPassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }
  
  const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword)
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error
  }
  
  // Validate terms acceptance if provided
  if (formData.termsAccepted !== undefined) {
    const termsValidation = validateTermsAcceptance(formData.termsAccepted)
    if (!termsValidation.isValid) {
      errors.termsAccepted = termsValidation.error
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates forgot password form
 */
export const validateForgotPasswordForm = (formData: ForgotPasswordFormData): FormValidationResult<ForgotPasswordFormData> => {
  return validateForm(
    { email: sanitizeInput(formData.email.toLowerCase()) },
    {
      email: VALIDATION_CONFIGS.email
    },
    {
      email: 'Email'
    }
  )
}

/**
 * Validates reset password form
 */
export const validateResetPasswordForm = (formData: ResetPasswordFormData): FormValidationResult<ResetPasswordFormData> => {
  const errors: Partial<Record<keyof ResetPasswordFormData, string>> = {}
  
  // Validate password
  const passwordValidation = validateStrongPassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }
  
  // Validate password confirmation
  const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword)
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error
  }
  
  // Validate token
  if (!formData.token || formData.token.trim().length === 0) {
    errors.token = 'Reset token is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates change password form
 */
export const validateChangePasswordForm = (formData: ChangePasswordFormData): FormValidationResult<ChangePasswordFormData> => {
  const errors: Partial<Record<keyof ChangePasswordFormData, string>> = {}
  
  // Validate current password
  if (!formData.currentPassword) {
    errors.currentPassword = 'Current password is required'
  }
  
  // Validate new password
  const newPasswordValidation = validateStrongPassword(formData.newPassword)
  if (!newPasswordValidation.isValid) {
    errors.newPassword = newPasswordValidation.error
  }
  
  // Check if new password is different from current
  if (formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password'
  }
  
  // Validate password confirmation
  const confirmPasswordValidation = validatePasswordConfirmation(formData.newPassword, formData.confirmPassword)
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// =============================================================================
// PASSWORD STRENGTH CHECKER
// =============================================================================

export interface PasswordStrength {
  score: number
  level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
  feedback: string[]
  isAcceptable: boolean
}

/**
 * Analyzes password strength and provides feedback
 */
export const checkPasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = []
  let score = 0
  
  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Use at least 8 characters')
  }
  
  if (password.length >= 12) {
    score += 1
  }
  
  // Character variety checks
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include lowercase letters')
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include uppercase letters')
  }
  
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Include numbers')
  }
  
  if (/[@$!%*?&]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include special characters (@$!%*?&)')
  }
  
  // Common patterns to avoid
  if (/(.)\1{2,}/.test(password)) {
    score -= 1
    feedback.push('Avoid repeating characters')
  }
  
  if (/123|abc|qwe|password/i.test(password)) {
    score -= 1
    feedback.push('Avoid common patterns')
  }
  
  // Determine level
  let level: PasswordStrength['level']
  if (score <= 1) level = 'very-weak'
  else if (score <= 2) level = 'weak'
  else if (score <= 3) level = 'fair'
  else if (score <= 4) level = 'good'
  else level = 'strong'
  
  return {
    score: Math.max(0, score),
    level,
    feedback,
    isAcceptable: score >= 3 // Minimum acceptable strength
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Prepares login data for submission by sanitizing inputs
 */
export const prepareLoginData = (formData: LoginFormData): LoginFormData => {
  return {
    username: sanitizeInput(formData.username),
    password: formData.password // Don't sanitize password
  }
}

/**
 * Prepares registration data for submission
 */
export const prepareRegistrationData = (formData: RegistrationFormData): Omit<RegistrationFormData, 'confirmPassword' | 'termsAccepted'> => {
  return {
    username: sanitizeInput(formData.username),
    email: sanitizeInput(formData.email.toLowerCase()),
    password: formData.password // Don't sanitize password
  }
}

/**
 * Validates a field in real-time during user input
 */
export const validateLoginField = (fieldName: keyof LoginFormData, value: string): ValidationResult => {
  switch (fieldName) {
    case 'username':
      return validateUsername(value)
    case 'password':
      return validatePassword(value)
    default:
      return { isValid: true }
  }
}

/**
 * Validates a registration field in real-time
 */
export const validateRegistrationField = (
  fieldName: keyof RegistrationFormData, 
  value: string, 
  allFormData?: RegistrationFormData
): ValidationResult => {
  switch (fieldName) {
    case 'username':
      return validateUsername(value)
    case 'email':
      return validateEmail(value)
    case 'password':
      return validateStrongPassword(value)
    case 'confirmPassword':
      if (allFormData) {
        return validatePasswordConfirmation(allFormData.password, value)
      }
      return { isValid: true }
    case 'termsAccepted':
      return validateTermsAcceptance(value === 'true' || !!value === true)
    default:
      return { isValid: true }
  }
}

/**
 * Checks if username is available (placeholder for API call)
 */
export const checkUsernameAvailability = async (username: string): Promise<ValidationResult> => {
  // This would typically make an API call to check username availability
  // For now, return a mock validation
  
  const basicValidation = validateUsername(username)
  if (!basicValidation.isValid) {
    return basicValidation
  }
  
  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock some taken usernames
  const takenUsernames = ['admin', 'user', 'test', 'demo']
  if (takenUsernames.includes(username.toLowerCase())) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.username.alreadyExists
    }
  }
  
  return { isValid: true }
}

/**
 * Checks if email is available (placeholder for API call)
 */
export const checkEmailAvailability = async (email: string): Promise<ValidationResult> => {
  const basicValidation = validateEmail(email)
  if (!basicValidation.isValid) {
    return basicValidation
  }
  
  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock some taken emails
  const takenEmails = ['admin@example.com', 'user@test.com', 'demo@demo.com']
  if (takenEmails.includes(email.toLowerCase())) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.email.alreadyExists
    }
  }
  
  return { isValid: true }
}