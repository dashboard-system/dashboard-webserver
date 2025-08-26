import { 
  validateField, 
  validateForm, 
  sanitizeInput,
  type ValidationResult, 
  type FormValidationResult,
  VALIDATION_CONFIGS,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES 
} from './validation'

// =============================================================================
// TYPES
// =============================================================================

export interface NetworkConfigFormData {
  ipAddress: string
  subnetMask: string
  gateway: string
  dnsServer: string
  alternativeDns?: string
  macAddress?: string
}

export interface WifiConfigFormData {
  ssid: string
  password: string
  security: 'WPA2' | 'WPA3' | 'Open'
  hidden?: boolean
}

export interface ServerConfigFormData {
  hostname: string
  port: string
  protocol: 'http' | 'https'
  apiKey?: string
}

export interface FirewallRuleFormData {
  ruleName: string
  sourceIP: string
  destinationIP: string
  port: string
  protocol: 'TCP' | 'UDP' | 'Both'
  action: 'Allow' | 'Deny'
}

// =============================================================================
// INDIVIDUAL FIELD VALIDATORS
// =============================================================================

/**
 * Validates IPv4 address
 */
export const validateIPv4 = (ip: string): ValidationResult => {
  const sanitized = sanitizeInput(ip)
  return validateField(sanitized, VALIDATION_CONFIGS.ipv4, 'IP Address')
}

/**
 * Validates IPv6 address
 */
export const validateIPv6 = (ip: string): ValidationResult => {
  const sanitized = sanitizeInput(ip)
  return validateField(sanitized, VALIDATION_CONFIGS.ipv6, 'IPv6 Address')
}

/**
 * Validates MAC address
 */
export const validateMacAddress = (mac: string): ValidationResult => {
  const sanitized = sanitizeInput(mac)
  return validateField(sanitized, VALIDATION_CONFIGS.macAddress, 'MAC Address')
}

/**
 * Validates URL
 */
export const validateURL = (url: string): ValidationResult => {
  const sanitized = sanitizeInput(url)
  return validateField(sanitized, VALIDATION_CONFIGS.url, 'URL')
}

/**
 * Validates domain name
 */
export const validateDomain = (domain: string): ValidationResult => {
  const sanitized = sanitizeInput(domain.toLowerCase())
  return validateField(sanitized, VALIDATION_CONFIGS.domain, 'Domain')
}

/**
 * Validates port number
 */
export const validatePort = (port: string): ValidationResult => {
  const sanitized = sanitizeInput(port)
  return validateField(sanitized, VALIDATION_CONFIGS.port, 'Port')
}

/**
 * Validates CIDR notation
 */
export const validateCIDR = (cidr: string): ValidationResult => {
  const sanitized = sanitizeInput(cidr)
  return validateField(sanitized, VALIDATION_CONFIGS.cidr, 'CIDR')
}

/**
 * Validates hostname
 */
export const validateHostname = (hostname: string): ValidationResult => {
  const sanitized = sanitizeInput(hostname.toLowerCase())
  
  // Hostname can be a domain or IP address
  const domainValidation = validateField(sanitized, VALIDATION_CONFIGS.domain, 'Hostname')
  if (domainValidation.isValid) {
    return domainValidation
  }
  
  // Try as IP address
  const ipValidation = validateIPv4(sanitized)
  if (ipValidation.isValid) {
    return ipValidation
  }
  
  return {
    isValid: false,
    error: 'Please enter a valid hostname or IP address'
  }
}

/**
 * Validates SSID (WiFi network name)
 */
export const validateSSID = (ssid: string): ValidationResult => {
  if (!ssid || !ssid.trim()) {
    return {
      isValid: false,
      error: 'Network name (SSID) is required'
    }
  }
  
  if (ssid.length < 1 || ssid.length > 32) {
    return {
      isValid: false,
      error: 'Network name must be between 1 and 32 characters'
    }
  }
  
  // SSID can contain any printable ASCII characters
  if (!/^[\x20-\x7E]+$/.test(ssid)) {
    return {
      isValid: false,
      error: 'Network name contains invalid characters'
    }
  }
  
  return { isValid: true }
}

/**
 * Validates WiFi password
 */
export const validateWifiPassword = (password: string, security: string): ValidationResult => {
  if (security === 'Open') {
    return { isValid: true } // No password needed for open networks
  }
  
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required for secured networks'
    }
  }
  
  if (password.length < 8 || password.length > 63) {
    return {
      isValid: false,
      error: 'WiFi password must be between 8 and 63 characters'
    }
  }
  
  return { isValid: true }
}

// =============================================================================
// NETWORK UTILITY VALIDATORS
// =============================================================================

/**
 * Checks if an IP address is in a private range
 */
export const isPrivateIP = (ip: string): boolean => {
  const privateRanges = [
    /^10\./,                           // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.0.0/12
    /^192\.168\./,                     // 192.168.0.0/16
    /^127\./,                          // 127.0.0.0/8 (loopback)
    /^169\.254\./                      // 169.254.0.0/16 (link-local)
  ]
  
  return privateRanges.some(range => range.test(ip))
}

/**
 * Checks if an IP is in the same subnet
 */
export const isInSameSubnet = (ip1: string, ip2: string, subnetMask: string): boolean => {
  const ipToInt = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0)
  }
  
  const ip1Int = ipToInt(ip1)
  const ip2Int = ipToInt(ip2)
  const maskInt = ipToInt(subnetMask)
  
  return (ip1Int & maskInt) === (ip2Int & maskInt)
}

/**
 * Validates subnet mask
 */
export const validateSubnetMask = (mask: string): ValidationResult => {
  const ipValidation = validateIPv4(mask)
  if (!ipValidation.isValid) {
    return ipValidation
  }
  
  // Check if it's a valid subnet mask (contiguous 1s followed by 0s)
  const maskInt = mask.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0)
  const maskBinary = maskInt.toString(2).padStart(32, '0')
  
  // Valid subnet mask should be like 11111111111111111111111100000000
  if (!/^1*0*$/.test(maskBinary)) {
    return {
      isValid: false,
      error: 'Invalid subnet mask format'
    }
  }
  
  return { isValid: true }
}

/**
 * Validates that gateway is in the same subnet as IP address
 */
export const validateGatewayInSubnet = (
  ipAddress: string, 
  gateway: string, 
  subnetMask: string
): ValidationResult => {
  const ipValidation = validateIPv4(ipAddress)
  const gatewayValidation = validateIPv4(gateway)
  const maskValidation = validateSubnetMask(subnetMask)
  
  if (!ipValidation.isValid) return ipValidation
  if (!gatewayValidation.isValid) return gatewayValidation
  if (!maskValidation.isValid) return maskValidation
  
  if (!isInSameSubnet(ipAddress, gateway, subnetMask)) {
    return {
      isValid: false,
      error: 'Gateway must be in the same subnet as the IP address'
    }
  }
  
  return { isValid: true }
}

// =============================================================================
// FORM VALIDATORS
// =============================================================================

/**
 * Validates network configuration form
 */
export const validateNetworkConfig = (formData: NetworkConfigFormData): FormValidationResult<NetworkConfigFormData> => {
  const errors: Partial<Record<keyof NetworkConfigFormData, string>> = {}
  
  // Validate individual fields
  const ipValidation = validateIPv4(formData.ipAddress)
  if (!ipValidation.isValid) {
    errors.ipAddress = ipValidation.error
  }
  
  const maskValidation = validateSubnetMask(formData.subnetMask)
  if (!maskValidation.isValid) {
    errors.subnetMask = maskValidation.error
  }
  
  const gatewayValidation = validateIPv4(formData.gateway)
  if (!gatewayValidation.isValid) {
    errors.gateway = gatewayValidation.error
  }
  
  const dnsValidation = validateIPv4(formData.dnsServer)
  if (!dnsValidation.isValid) {
    errors.dnsServer = dnsValidation.error
  }
  
  // Validate optional alternative DNS
  if (formData.alternativeDns && formData.alternativeDns.trim()) {
    const altDnsValidation = validateIPv4(formData.alternativeDns)
    if (!altDnsValidation.isValid) {
      errors.alternativeDns = altDnsValidation.error
    }
  }
  
  // Validate optional MAC address
  if (formData.macAddress && formData.macAddress.trim()) {
    const macValidation = validateMacAddress(formData.macAddress)
    if (!macValidation.isValid) {
      errors.macAddress = macValidation.error
    }
  }
  
  // Cross-field validation: gateway in subnet
  if (!errors.ipAddress && !errors.gateway && !errors.subnetMask) {
    const gatewayInSubnetValidation = validateGatewayInSubnet(
      formData.ipAddress, 
      formData.gateway, 
      formData.subnetMask
    )
    if (!gatewayInSubnetValidation.isValid) {
      errors.gateway = gatewayInSubnetValidation.error
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates WiFi configuration form
 */
export const validateWifiConfig = (formData: WifiConfigFormData): FormValidationResult<WifiConfigFormData> => {
  const errors: Partial<Record<keyof WifiConfigFormData, string>> = {}
  
  const ssidValidation = validateSSID(formData.ssid)
  if (!ssidValidation.isValid) {
    errors.ssid = ssidValidation.error
  }
  
  const passwordValidation = validateWifiPassword(formData.password, formData.security)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates server configuration form
 */
export const validateServerConfig = (formData: ServerConfigFormData): FormValidationResult<ServerConfigFormData> => {
  const errors: Partial<Record<keyof ServerConfigFormData, string>> = {}
  
  const hostnameValidation = validateHostname(formData.hostname)
  if (!hostnameValidation.isValid) {
    errors.hostname = hostnameValidation.error
  }
  
  const portValidation = validatePort(formData.port)
  if (!portValidation.isValid) {
    errors.port = portValidation.error
  }
  
  // Validate API key if provided
  if (formData.apiKey && formData.apiKey.trim()) {
    if (formData.apiKey.length < 10) {
      errors.apiKey = 'API key is too short'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates firewall rule form
 */
export const validateFirewallRule = (formData: FirewallRuleFormData): FormValidationResult<FirewallRuleFormData> => {
  const errors: Partial<Record<keyof FirewallRuleFormData, string>> = {}
  
  // Validate rule name
  if (!formData.ruleName || !formData.ruleName.trim()) {
    errors.ruleName = 'Rule name is required'
  } else if (formData.ruleName.length > 50) {
    errors.ruleName = 'Rule name must be less than 50 characters'
  }
  
  // Validate source IP (can be single IP or CIDR)
  const sourceIPValidation = validateIPv4(formData.sourceIP)
  const sourceCIDRValidation = validateCIDR(formData.sourceIP)
  if (!sourceIPValidation.isValid && !sourceCIDRValidation.isValid) {
    errors.sourceIP = 'Please enter a valid IP address or CIDR notation'
  }
  
  // Validate destination IP
  const destIPValidation = validateIPv4(formData.destinationIP)
  const destCIDRValidation = validateCIDR(formData.destinationIP)
  if (!destIPValidation.isValid && !destCIDRValidation.isValid) {
    errors.destinationIP = 'Please enter a valid IP address or CIDR notation'
  }
  
  // Validate port (can be single port or range)
  const portValidation = validatePort(formData.port)
  const portRangeValidation = validatePortRange(formData.port)
  if (!portValidation.isValid && !portRangeValidation.isValid) {
    errors.port = 'Please enter a valid port number or range (e.g., 8080 or 8080-8090)'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates port range (e.g., "8080-8090")
 */
export const validatePortRange = (portRange: string): ValidationResult => {
  const sanitized = sanitizeInput(portRange)
  
  // Single port
  if (!/\-/.test(sanitized)) {
    return validatePort(sanitized)
  }
  
  // Port range
  const parts = sanitized.split('-')
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: 'Invalid port range format. Use format: 8080-8090'
    }
  }
  
  const startPort = parseInt(parts[0])
  const endPort = parseInt(parts[1])
  
  if (isNaN(startPort) || isNaN(endPort)) {
    return {
      isValid: false,
      error: 'Port range must contain valid numbers'
    }
  }
  
  if (startPort < 1 || startPort > 65535 || endPort < 1 || endPort > 65535) {
    return {
      isValid: false,
      error: 'Ports must be between 1 and 65535'
    }
  }
  
  if (startPort >= endPort) {
    return {
      isValid: false,
      error: 'Start port must be less than end port'
    }
  }
  
  return { isValid: true }
}

/**
 * Validates a network field in real-time
 */
export const validateNetworkField = (
  fieldName: keyof NetworkConfigFormData, 
  value: string
): ValidationResult => {
  switch (fieldName) {
    case 'ipAddress':
      return validateIPv4(value)
    case 'subnetMask':
      return validateSubnetMask(value)
    case 'gateway':
      return validateIPv4(value)
    case 'dnsServer':
    case 'alternativeDns':
      return validateIPv4(value)
    case 'macAddress':
      return validateMacAddress(value)
    default:
      return { isValid: true }
  }
}

/**
 * Prepares network config data for submission
 */
export const prepareNetworkConfigData = (formData: NetworkConfigFormData): NetworkConfigFormData => {
  return {
    ipAddress: sanitizeInput(formData.ipAddress),
    subnetMask: sanitizeInput(formData.subnetMask),
    gateway: sanitizeInput(formData.gateway),
    dnsServer: sanitizeInput(formData.dnsServer),
    alternativeDns: formData.alternativeDns ? sanitizeInput(formData.alternativeDns) : undefined,
    macAddress: formData.macAddress ? sanitizeInput(formData.macAddress) : undefined
  }
}