import Database from "better-sqlite3";
import DatabaseManager from "../../data/database";
import { PasswordUtils } from "../../utils/password";

export interface User {
  id: number;
  username: string;
  role: 'engineer' | 'maintainer' | 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  username?: string;
  password?: string;
  role?: string;
}

export class UserModel {
  private db: Database.Database;

  constructor() {
    this.db = DatabaseManager.getInstance().getDatabase();
  }

  // Create a new user
  async createUser(userData: CreateUserData): Promise<User> {
    const { username, password, role = 'user' } = userData;
    
    // Hash the password
    const hashedPassword = await PasswordUtils.hashPassword(password);
    
    const stmt = this.db.prepare(`
      INSERT INTO users (username, password, role)
      VALUES (?, ?, ?)
    `);
    
    try {
      const result = stmt.run(username, hashedPassword, role);
      return this.getUserById(result.lastInsertRowid as number)!;
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Username already exists');
      }
      throw error;
    }
  }

  // Get user by ID
  getUserById(id: number): User | null {
    const stmt = this.db.prepare(`
      SELECT id, username, role, created_at, updated_at
      FROM users WHERE id = ?
    `);
    
    return stmt.get(id) as User | null;
  }

  // Get user by username
  getUserByUsername(username: string): UserWithPassword | null {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE username = ?
    `);
    
    return stmt.get(username) as UserWithPassword | null;
  }

  // Get all users with pagination
  getAllUsers(page: number = 1, limit: number = 10, search?: string): { users: User[]; total: number } {
    let whereClause = '';
    let params: any[] = [];
    
    if (search) {
      whereClause = 'WHERE username LIKE ?';
      params = [`%${search}%`];
    }
    
    // Get total count
    const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM users ${whereClause}`);
    const { count } = countStmt.get(...params) as { count: number };
    
    // Get paginated results
    const offset = (page - 1) * limit;
    const stmt = this.db.prepare(`
      SELECT id, username, role, created_at, updated_at
      FROM users ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    
    const users = stmt.all(...params, limit, offset) as User[];
    
    return { users, total: count };
  }

  // Update user
  async updateUser(id: number, updateData: UpdateUserData): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (updateData.username) {
      updates.push('username = ?');
      values.push(updateData.username);
    }
    
    if (updateData.password) {
      updates.push('password = ?');
      values.push(await PasswordUtils.hashPassword(updateData.password));
    }
    
    if (updateData.role) {
      updates.push('role = ?');
      values.push(updateData.role);
    }
    
    if (updates.length === 0) {
      return this.getUserById(id);
    }
    
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE users SET ${updates.join(', ')}
      WHERE id = ?
    `);
    
    try {
      stmt.run(...values);
      return this.getUserById(id);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Username already exists');
      }
      throw error;
    }
  }

  // Delete user
  deleteUser(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Verify user password
  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = this.getUserByUsername(username);
    if (!user) {
      return null;
    }
    
    const isValid = await PasswordUtils.comparePassword(password, user.password);
    if (!isValid) {
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get user stats
  getUserStats(): { total: number; byRole: Record<string, number> } {
    // Total users
    const totalStmt = this.db.prepare('SELECT COUNT(*) as count FROM users');
    const { count: total } = totalStmt.get() as { count: number };
    
    // Users by role
    const roleStmt = this.db.prepare('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    const roleResults = roleStmt.all() as { role: string; count: number }[];
    
    const byRole: Record<string, number> = {};
    roleResults.forEach(({ role, count }) => {
      byRole[role] = count;
    });
    
    return { total, byRole };
  }
}