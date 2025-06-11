// src/index.ts
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Import route modules
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import healthRoutes from './routes/health'

// Load environment variables
dotenv.config()

const app = express()
const PORT = parseInt(process.env.PORT || '3000', 10)
const HOST = process.env.HOST || 'localhost'

// Middleware
app.use(helmet()) // Security headers
app.use(cors()) // Enable CORS
app.use(morgan('combined')) // Logging
app.use(express.json({ limit: '10mb' })) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Routes
app.use('/health', healthRoutes)
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

// // 404 handler - should be last
app.all('/*splat', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  })
})

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})
