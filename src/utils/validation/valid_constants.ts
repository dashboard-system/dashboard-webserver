// =============================================================================
// VALIDATION PATTERNS
// =============================================================================

export const VALIDATION_PATTERNS = {
  // Authentication
  username: /^[a-zA-Z0-9_-]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
  
  // Network
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  ipv6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/,
  macAddress: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
  url: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/,
  domain: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
  port: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/,
  
  // Personal Information
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/,
  
  // Technical
  hexColor: /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  version: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
  
  // Financial
  currency: /^\d+(\.\d{2})?$/,
  
  // Alphanumeric variations
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
  alphabeticOnly: /^[a-zA-Z]+$/,
  numericOnly: /^\d+$/,
} as const

// =============================================================================
// VALIDATION LIMITS
// =============================================================================

export const VALIDATION_LIMITS = {
  // Authentication
  username: { min: 3, max: 50 },
  password: { min: 6, max: 100 },
  strongPassword: { min: 8, max: 100 },
  email: { min: 5, max: 254 },
  
  // Network
  domain: { min: 1, max: 253 },
  
  // Personal
  phone: { min: 10, max: 15 },
  
  // Technical
  slug: { min: 1, max: 100 },
  hexColor: { min: 3, max: 7 },
  
  // General
  shortText: { min: 1, max: 50 },
  mediumText: { min: 1, max: 255 },
  longText: { min: 1, max: 1000 },
} as const

// =============================================================================
// ERROR MESSAGES
// =============================================================================

export const ERROR_MESSAGES = {
  // Generic messages
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters long`,
  maxLength: (field: string, max: number) => `${field} must be less than ${max} characters`,
  invalidFormat: (field: string) => `Please enter a valid ${field.toLowerCase()}`,
  
  // Authentication
  username: {
    required: 'Username is required',
    minLength: `Username must be at least ${VALIDATION_LIMITS.username.min} characters long`,
    maxLength: `Username must be less than ${VALIDATION_LIMITS.username.max} characters`,
    invalidFormat: 'Username can only contain letters, numbers, underscores, and hyphens',
    alreadyExists: 'Username is already taken',
  },
  
  password: {
    required: 'Password is required',
    minLength: `Password must be at least ${VALIDATION_LIMITS.password.min} characters long`,
    maxLength: `Password must be less than ${VALIDATION_LIMITS.password.max} characters`,
    weak: 'Password is too weak',
    mismatch: 'Passwords do not match',
  },
  
  strongPassword: {
    required: 'Password is required',
    minLength: `Password must be at least ${VALIDATION_LIMITS.strongPassword.min} characters long`,
    maxLength: `Password must be less than ${VALIDATION_LIMITS.strongPassword.max} characters`,
    invalidFormat: 'Password must contain uppercase, lowercase, number, and special character',
    weak: 'Password is too weak. Use a mix of letters, numbers, and symbols',
  },
  
  email: {
    required: 'Email address is required',
    invalidFormat: 'Please enter a valid email address',
    alreadyExists: 'Email address is already registered',
    notFound: 'Email address not found',
  },
  
  // Network
  ipv4: {
    required: 'IP address is required',
    invalidFormat: 'Please enter a valid IPv4 address (e.g., 192.168.1.1)',
    privateRange: 'IP address is in private range',
    publicRange: 'IP address is in public range',
    invalidRange: 'IP address is not in the allowed range',
  },
  
  ipv6: {
    required: 'IPv6 address is required',
    invalidFormat: 'Please enter a valid IPv6 address',
  },
  
  macAddress: {
    required: 'MAC address is required',
    invalidFormat: 'Please enter a valid MAC address (e.g., 00:1B:44:11:3A:B7 or 00-1B-44-11-3A-B7)',
    duplicate: 'MAC address is already in use',
  },
  
  url: {
    required: 'URL is required',
    invalidFormat: 'Please enter a valid URL (e.g., https://example.com)',
    unreachable: 'URL is not reachable',
  },
  
  domain: {
    required: 'Domain name is required',
    invalidFormat: 'Please enter a valid domain name',
    notResolvable: 'Domain name cannot be resolved',
  },
  
  port: {
    required: 'Port number is required',
    invalidFormat: 'Please enter a valid port number (1-65535)',
    inUse: 'Port is already in use',
    reserved: 'Port is reserved for system use',
  },
  
  cidr: {
    required: 'CIDR notation is required',
    invalidFormat: 'Please enter a valid CIDR notation (e.g., 192.168.1.0/24)',
    invalidSubnet: 'Invalid subnet mask',
  },
  
  // Personal Information
  phone: {
    required: 'Phone number is required',
    invalidFormat: 'Please enter a valid phone number',
    alreadyExists: 'Phone number is already registered',
  },
  
  zipCode: {
    required: 'ZIP code is required',
    invalidFormat: 'Please enter a valid ZIP code',
  },
  
  creditCard: {
    required: 'Credit card number is required',
    invalidFormat: 'Please enter a valid credit card number',
    expired: 'Credit card has expired',
    declined: 'Credit card was declined',
  },
  
  // Technical
  hexColor: {
    required: 'Color is required',
    invalidFormat: 'Please enter a valid hex color (e.g., #FF0000 or #F00)',
  },
  
  uuid: {
    required: 'UUID is required',
    invalidFormat: 'Please enter a valid UUID',
  },
  
  slug: {
    required: 'Slug is required',
    invalidFormat: 'Slug can only contain lowercase letters, numbers, and hyphens',
    alreadyExists: 'Slug is already taken',
  },
  
  version: {
    required: 'Version is required',
    invalidFormat: 'Please enter a valid version number (e.g., 1.0.0)',
  },
  
  currency: {
    required: 'Amount is required',
    invalidFormat: 'Please enter a valid currency amount',
    tooLow: 'Amount is too low',
    tooHigh: 'Amount is too high',
  },
  
  // File upload
  file: {
    required: 'File is required',
    tooLarge: 'File is too large',
    invalidType: 'Invalid file type',
    uploadFailed: 'File upload failed',
  },
  
  // Form submission
  form: {
    submissionFailed: 'Form submission failed. Please try again.',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    validationFailed: 'Please correct the errors below.',
  },
} as const

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================

export const SUCCESS_MESSAGES = {
  // Authentication
  login: 'Login successful!',
  logout: 'Logout successful!',
  registration: 'Account created successfully!',
  passwordReset: 'Password reset email sent!',
  passwordChanged: 'Password changed successfully!',
  
  // Network
  networkConfigSaved: 'Network configuration saved successfully!',
  connectionEstablished: 'Connection established successfully!',
  
  // General
  saved: 'Changes saved successfully!',
  deleted: 'Item deleted successfully!',
  updated: 'Item updated successfully!',
  created: 'Item created successfully!',
  uploaded: 'File uploaded successfully!',
} as const

// =============================================================================
// VALIDATION CONFIGURATIONS
// =============================================================================

export const VALIDATION_CONFIGS = {
  // Authentication
  username: {
    required: true,
    minLength: VALIDATION_LIMITS.username.min,
    maxLength: VALIDATION_LIMITS.username.max,
    pattern: VALIDATION_PATTERNS.username,
  },
  
  password: {
    required: true,
    minLength: VALIDATION_LIMITS.password.min,
    maxLength: VALIDATION_LIMITS.password.max,
  },
  
  strongPassword: {
    required: true,
    minLength: VALIDATION_LIMITS.strongPassword.min,
    maxLength: VALIDATION_LIMITS.strongPassword.max,
    pattern: VALIDATION_PATTERNS.strongPassword,
  },
  
  email: {
    required: true,
    minLength: VALIDATION_LIMITS.email.min,
    maxLength: VALIDATION_LIMITS.email.max,
    pattern: VALIDATION_PATTERNS.email,
  },
  
  // Network
  ipv4: {
    required: true,
    pattern: VALIDATION_PATTERNS.ipv4,
  },
  
  ipv6: {
    required: true,
    pattern: VALIDATION_PATTERNS.ipv6,
  },
  
  macAddress: {
    required: true,
    pattern: VALIDATION_PATTERNS.macAddress,
  },
  
  url: {
    required: true,
    pattern: VALIDATION_PATTERNS.url,
  },
  
  domain: {
    required: true,
    minLength: VALIDATION_LIMITS.domain.min,
    maxLength: VALIDATION_LIMITS.domain.max,
    pattern: VALIDATION_PATTERNS.domain,
  },
  
  port: {
    required: true,
    pattern: VALIDATION_PATTERNS.port,
  },
  
  cidr: {
    required: true,
    pattern: VALIDATION_PATTERNS.cidr,
  },
} as const