import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './db/sqlite.db';

// Type for health check result
interface HealthCheckResult {
  health: number;
}

class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database.Database;

  private constructor() {
    // Ensure database directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Initialize database connection
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL'); // Enable WAL mode for better performance
    this.db.pragma('foreign_keys = ON'); // Enable foreign key constraints
    
    this.initializeSchema();
    
    console.log(`📀 Database connected: ${DB_PATH}`);
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeSchema(): void {
    try {
      // Create users table if it doesn't exist
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        
        CREATE TRIGGER IF NOT EXISTS update_users_timestamp
        AFTER UPDATE ON users
        BEGIN
          UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
        END;
      `);
      
      console.log('✅ Database schema initialized');
    } catch (error) {
      console.error('❌ Database schema initialization failed:', error);
      throw error;
    }
  }

  public getDatabase(): Database.Database {
    return this.db;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      console.log('📀 Database connection closed');
    }
  }

  // Health check method
  public isHealthy(): boolean {
    try {
      const stmt = this.db.prepare('SELECT 1 as health');
      const result = stmt.get() as HealthCheckResult | undefined;
      return result?.health === 1;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Get database info
  public getInfo(): { path: string; size: number; isHealthy: boolean } {
    try {
      const stats = fs.statSync(DB_PATH);
      return {
        path: DB_PATH,
        size: stats.size,
        isHealthy: this.isHealthy()
      };
    } catch (error) {
      return {
        path: DB_PATH,
        size: 0,
        isHealthy: false
      };
    }
  }
}

export default DatabaseManager;