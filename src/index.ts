// src/index.ts
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Import database manager
import DatabaseManager from './data/database'

// Import route modules
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import healthRoutes from './routes/health' // Updated health routes

// Load environment variables
dotenv.config()

const app = express()
const PORT = parseInt(process.env.PORT || '3000', 10)
const HOST = process.env.HOST || '0.0.0.0'

// Initialize database connection early
let dbManager: DatabaseManager | null = null

try {
  dbManager = DatabaseManager.getInstance()
  console.log('Database initialization completed')
} catch (error) {
  console.error('Failed to initialize database:', error)
  process.exit(1)
}

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/health', healthRoutes) // Now includes /health/db and /health/system
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack)

  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
  })
})

// 404 handler
app.all('/*splat', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  })
})

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`)
  console.log(`📊 DB Health check: http://${HOST}:${PORT}/health/db`)
  console.log(`📊 System Health check: http://${HOST}:${PORT}/health/system`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
})

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `❌ Port ${PORT} is already in use. Try a different port or kill the existing process.`,
    )
    process.exit(1)
  } else {
    console.error('Server error:', error)
    process.exit(1)
  }
})

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received, shutting down gracefully`)

  server.close(() => {
    console.log('HTTP server closed')

    // Close database connection safely
    try {
      if (dbManager) {
        dbManager.close()
        console.log('Database connection closed')
      }
    } catch (error) {
      console.error('Error closing database:', error)
    }

    console.log('Graceful shutdown completed')
    process.exit(0)
  })

  // Force close after 10 seconds
  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down',
    )
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
