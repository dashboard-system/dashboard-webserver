import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import * as schema from './schema'
import { sql } from 'drizzle-orm'

interface DatabaseConfig {
  filename: string
  readonly?: boolean
  fileMustExist?: boolean
  timeout?: number
  verbose?: ((message?: any, ...optionalParams: any[]) => void) | undefined
}

class DatabaseManager {
  private static instance: DatabaseManager
  private sqlite!: Database.Database
  private db!: ReturnType<typeof drizzle<typeof schema>>
  private config: DatabaseConfig

  private constructor() {
    this.config = {
      filename: process.env.DATABASE_PATH || './db/sqlite.db',
      timeout: parseInt(process.env.DB_TIMEOUT || '60000', 10),
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    }

    this.initializeDatabase()
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  private initializeDatabase(): void {
    try {
      // Ensure database directory exists
      const dbDir = path.dirname(this.config.filename)
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true })
      }

      this.sqlite = new Database(this.config.filename, this.config)
      this.db = drizzle(this.sqlite, { schema })

      // Enable WAL mode for better concurrency
      this.sqlite.pragma('journal_mode = WAL')
      this.sqlite.pragma('synchronous = NORMAL')
      this.sqlite.pragma('cache_size = 1000000')
      this.sqlite.pragma('temp_store = memory')

      console.log('✅ Database connected:', this.config.filename)
      this.initializeSchema()
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  }

  private initializeSchema(): void {
    try {
      // Create tables using raw SQL for initial setup
      this.sqlite.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS dashboard_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          data_type TEXT NOT NULL,
          value TEXT NOT NULL,
          timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_dashboard_timestamp ON dashboard_data(timestamp);
        CREATE INDEX IF NOT EXISTS idx_dashboard_user ON dashboard_data(user_id);
      `)

      console.log('✅ Database schema initialized')
    } catch (error) {
      console.error('❌ Schema initialization failed:', error)
      throw error
    }
  }

  public getDatabase(): ReturnType<typeof drizzle<typeof schema>> {
    return this.db
  }

  public getSqliteDatabase(): Database.Database {
    return this.sqlite
  }

  // Health check method
  public async healthCheck(): Promise<{
    status: string
    database: string
    details?: any
  }> {
    try {
      // Simple query to verify connection
      this.db.select({ test: sql<number>`1` })

      // Additional health metrics
      const tableCount = this.sqlite
        .prepare(
          `
        SELECT COUNT(*) as count 
        FROM sqlite_master 
        WHERE type='table'
      `,
        )
        .get() as { count: number }

      return {
        status: 'OK',
        database: 'connected',
        details: {
          tables: tableCount.count,
          filename: this.config.filename,
          mode: this.sqlite.pragma('journal_mode', { simple: true }),
          cache_size: this.sqlite.pragma('cache_size', { simple: true }),
        },
      }
    } catch (error) {
      console.error('Database health check failed:', error)
      return {
        status: 'ERROR',
        database: 'disconnected',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }
    }
  }

  // Graceful shutdown
  public close(): void {
    if (this.sqlite) {
      this.sqlite.close()
      console.log('📀 Database connection closed')
    }
  }
}

export default DatabaseManager