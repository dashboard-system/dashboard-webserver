// utils/validation/index.ts

// Export base validation utilities
export * from './validation'
export * from './valid_constants'

// Export specialized validation modules
export * from './login_validation'
export * from './network_validation'

// Re-export commonly used types for convenience
export type {
  ValidationResult,
  ValidationRule,
  FormValidationResult,
  FormValidationErrors
} from './validation'

export type {
  LoginFormData,
  RegistrationFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
  PasswordStrength
} from './login_validation'

export type {
  NetworkConfigFormData,
  WifiConfigFormData,
  ServerConfigFormData,
  FirewallRuleFormData
} from './network_validation'

// Re-export commonly used functions for convenience
export {
  validateField,
  validateForm,
  sanitizeInput,
  formatFieldName,
  isEmpty,
  areRequiredFieldsFilled
} from './validation'

export {
  validateUsername,
  validatePassword,
  validateEmail,
  validateLoginForm,
  validateRegistrationForm,
  checkPasswordStrength
} from './login_validation'

export {
  validateIPv4,
  validateIPv6,
  validateMacAddress,
  validateURL,
  validateDomain,
  validatePort,
  validateCIDR,
  validateNetworkConfig,
  isPrivateIP
} from './network_validation'

// utils/
// └── validation/
//     ├── index.ts                 # Main export file
//     ├── constants.ts             # All error messages, patterns, configs
//     ├── validation.ts            # Base validation functions
//     ├── login_validation.ts      # Authentication-specific validation
//     └── network_validation.ts    # Network-specific validation