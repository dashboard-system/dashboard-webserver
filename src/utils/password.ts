// src/utils/password.ts
import bcrypt from 'bcryptjs'

export class PasswordUtils {
  private static readonly SALT_ROUNDS = 12

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS)
      const hashedPassword = await bcrypt.hash(password, salt)
      return hashedPassword
    } catch (error) {
      console.error('Password hashing error:', error)
      throw new Error('Failed to hash password')
    }
  }

  // Compare password with hash
  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword)
      return isMatch
    } catch (error) {
      console.error('Password comparison error:', error)
      throw new Error('Failed to compare password')
    }
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push(
        'Password must contain at least one special character (@$!%*?&)',
      )
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
