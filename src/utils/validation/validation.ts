import { 
  VALIDATION_PATTERNS, 
  VALIDATION_LIMITS, 
  ERROR_MESSAGES,
  VALIDATION_CONFIGS 
} from './valid_constants'

// =============================================================================
// TYPES
// =============================================================================

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  customValidator?: (value: string) => ValidationResult
  allowEmpty?: boolean
}

export interface FormValidationResult<T> {
  isValid: boolean
  errors: Partial<Record<keyof T, string>>
}

export type FormValidationErrors = Record<string, string | undefined>

// =============================================================================
// CORE VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates a field value against specified rules
 */
export const validateField = (
  value: string, 
  rules: ValidationRule,
  fieldDisplayName?: string
): ValidationResult => {
  const fieldName = fieldDisplayName || 'Field'
  
  // Handle required validation
  if (rules.required && (!value || !value.trim())) {
    return { 
      isValid: false, 
      error: ERROR_MESSAGES.required(fieldName)
    }
  }
  
  // Allow empty values if not required
  if (!rules.required && (!value || !value.trim())) {
    return { isValid: true }
  }
  
  // Validate minimum length
  if (rules.minLength !== undefined && value.length < rules.minLength) {
    return { 
      isValid: false, 
      error: ERROR_MESSAGES.minLength(fieldName, rules.minLength)
    }
  }
  
  // Validate maximum length
  if (rules.maxLength !== undefined && value.length > rules.maxLength) {
    return { 
      isValid: false, 
      error: ERROR_MESSAGES.maxLength(fieldName, rules.maxLength)
    }
  }
  
  // Validate pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    return { 
      isValid: false, 
      error: ERROR_MESSAGES.invalidFormat(fieldName)
    }
  }
  
  // Run custom validator
  if (rules.customValidator) {
    return rules.customValidator(value)
  }
  
  return { isValid: true }
}

/**
 * Validates multiple form fields at once
 */
export const validateForm = <T extends Record<string, string>>(
  formData: T,
  validationRules: Partial<Record<keyof T, ValidationRule>>,
  fieldDisplayNames?: Partial<Record<keyof T, string>>
): FormValidationResult<T> => {
  const errors: Partial<Record<keyof T, string>> = {}
  
  for (const [fieldName, value] of Object.entries(formData)) {
    const rules = validationRules[fieldName as keyof T]
    if (!rules) continue
    
    const displayName = fieldDisplayNames?.[fieldName as keyof T] || formatFieldName(fieldName)
    const validation = validateField(value, rules, displayName)
    
    if (!validation.isValid) {
      errors[fieldName as keyof T] = validation.error
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates a single field using predefined configuration
 */
export const validatePredefinedField = (
  value: string, 
  fieldType: keyof typeof VALIDATION_CONFIGS
): ValidationResult => {
  const config = VALIDATION_CONFIGS[fieldType]
  return validateField(value, config, formatFieldName(fieldType))
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Formats field names for display in error messages
 */
export const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Sanitizes user input by removing potentially harmful characters
 */
export const sanitizeInput = (input: string, options: {
  removeHTML?: boolean
  removeSpecialChars?: boolean
  preserveSpaces?: boolean
  trimWhitespace?: boolean
} = {}): string => {
  let sanitized = input
  
  // Trim whitespace by default
  if (options.trimWhitespace !== false) {
    sanitized = sanitized.trim()
  }
  
  // Remove HTML tags
  if (options.removeHTML) {
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }
  
  // Remove potentially dangerous special characters
  if (options.removeSpecialChars) {
    sanitized = sanitized.replace(/[<>'";&\\]/g, '')
  }
  
  // Normalize spaces
  if (!options.preserveSpaces) {
    sanitized = sanitized.replace(/\s+/g, ' ')
  }
  
  return sanitized
}

/**
 * Checks if a string is empty or only whitespace
 */
export const isEmpty = (value: string): boolean => {
  return !value || !value.trim()
}

/**
 * Checks if all required fields in a form are filled
 */
export const areRequiredFieldsFilled = <T extends Record<string, string>>(
  formData: T,
  requiredFields: (keyof T)[]
): boolean => {
  return requiredFields.every(field => !isEmpty(formData[field]))
}

/**
 * Creates a debounced validation function for real-time validation
 */
export const createDebouncedValidator = (
  validator: (value: string) => ValidationResult,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout
  
  return (value: string, callback: (result: ValidationResult) => void) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      const result = validator(value)
      callback(result)
    }, delay)
  }
}

// =============================================================================
// EXPORT PATTERNS AND CONFIGS FOR REUSE
// =============================================================================

export { 
  VALIDATION_PATTERNS, 
  VALIDATION_LIMITS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  VALIDATION_CONFIGS 
} from './valid_constants'