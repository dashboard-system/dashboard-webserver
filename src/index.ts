// src/index.ts
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'

// Import database manager
import DatabaseManager from './data/database'

// Import route modules
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import healthRoutes from './routes/health' // Updated health routes
import uciRoutes from './routes/uci'

// Import middleware
import HTMLFallbackMiddleware from './middleware/htmlFallback'

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

// API Routes
app.use('/health', healthRoutes) // Now includes /health/db and /health/system
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/uci', uciRoutes)

const isAbleAccessUI = process.env.IS_ABLE_ACCESS_UI || true
const uiDistPath = isAbleAccessUI
  ? path.join(__dirname, '..', 'ui', 'dist')
  : 'undefined'

if (isAbleAccessUI) {
  // Configure UI serving

  // Serve static files from UI build directory
  app.use(express.static(uiDistPath))

  // SPA fallback - serve index.html for all non-API routes
  app.use(
    HTMLFallbackMiddleware.create({
      uiDistPath,
      apiPrefixes: ['/api/', '/health'],
      indexFile: 'index.html',
    }),
  )
} else {
  // 404 handler
  app.all('/*splat', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'Route not found',
      path: req.originalUrl,
      method: req.method,
    })
  })
}

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

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
  console.log(`🎨 UI available at: http://${HOST}:${PORT}`)
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`)
  console.log(`📊 DB Health check: http://${HOST}:${PORT}/health/db`)
  console.log(`📊 System Health check: http://${HOST}:${PORT}/health/system`)
  console.log(`⚙️  UCI Config API: http://${HOST}:${PORT}/api/uci`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📁 UI files served from: ${uiDistPath}`)
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
