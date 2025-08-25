import DatabaseManager from '../../data/database'
import { PasswordUtils } from '../../utils/password'
import { users } from '../../data/schema'
import { eq, like, count, desc } from 'drizzle-orm'
import type { User, NewUser } from '../../data/schema'

export interface UserWithPassword extends User {
  password: string
}

export interface CreateUserData {
  username: string
  password: string
  role?: 'engineer' | 'maintainer' | 'admin' | 'user'
}

export interface UpdateUserData {
  username?: string
  password?: string
  role?: 'engineer' | 'maintainer' | 'admin' | 'user'
}

export class UserModel {
  private db

  constructor() {
    this.db = DatabaseManager.getInstance().getDatabase()
  }

  // Create a new user
  async createUser(userData: CreateUserData): Promise<User> {
    const { username, password, role = 'user' } = userData

    // Hash the password
    const hashedPassword = await PasswordUtils.hashPassword(password)

    try {
      const [newUser] = await this.db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          role,
        })
        .returning()
      
      return newUser
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Username already exists')
      }
      throw error
    }
  }

  // Get user by ID
  async getUserById(id: number): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!result[0]) return null

    const { password: _, ...userWithoutPassword } = result[0]
    return userWithoutPassword as User
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<UserWithPassword | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    return result[0] as UserWithPassword || null
  }

  // Get all users with pagination
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit
    
    // Get total count and paginated results
    if (search) {
      const whereCondition = like(users.username, `%${search}%`)
      
      const countResult = await this.db
        .select({ count: count() })
        .from(users)
        .where(whereCondition)
      
      const userResults = await this.db
        .select()
        .from(users)
        .where(whereCondition)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset)
      
      const usersWithoutPassword = userResults.map(({ password: _, ...user }) => user)
      return { users: usersWithoutPassword as User[], total: countResult[0].count }
    } else {
      const countResult = await this.db.select({ count: count() }).from(users)
      
      const userResults = await this.db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset)
      
      const usersWithoutPassword = userResults.map(({ password: _, ...user }) => user)
      return { users: usersWithoutPassword as User[], total: countResult[0].count }
    }
  }

  // Update user
  async updateUser(
    id: number,
    updateData: UpdateUserData,
  ): Promise<User | null> {
    const updateFields: Partial<NewUser> = {}

    if (updateData.username) {
      updateFields.username = updateData.username
    }

    if (updateData.password) {
      updateFields.password = await PasswordUtils.hashPassword(updateData.password)
    }

    if (updateData.role) {
      updateFields.role = updateData.role
    }

    if (Object.keys(updateFields).length === 0) {
      return await this.getUserById(id)
    }

    try {
      await this.db
        .update(users)
        .set(updateFields)
        .where(eq(users.id, id))

      return await this.getUserById(id)
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Username already exists')
      }
      throw error
    }
  }

  // Delete user
  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id))
    return result.changes > 0
  }

  // Verify user password
  async verifyPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.getUserByUsername(username)
    if (!user) {
      return null
    }

    const isValid = await PasswordUtils.comparePassword(password, user.password)
    if (!isValid) {
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  // Get user stats
  async getUserStats(): Promise<{ total: number; byRole: Record<string, number> }> {
    // Total users
    const [{ count: total }] = await this.db.select({ count: count() }).from(users)

    // Users by role
    const roleResults = await this.db
      .select({
        role: users.role,
        count: count(),
      })
      .from(users)
      .groupBy(users.role)

    const byRole: Record<string, number> = {}
    roleResults.forEach(({ role, count }) => {
      byRole[role] = count
    })

    return { total, byRole }
  }
}
