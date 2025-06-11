// src/routes/health.ts
import { Router, Request, Response } from 'express'
import DatabaseManager from '../data/database'

const router = Router()

// Basic health check
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  })
})

// Database health check
router.get('/db', async (req: Request, res: Response) => {
  try {
    const dbManager = DatabaseManager.getInstance()
    const healthResult = await dbManager.healthCheck()

    if (healthResult.status === 'OK') {
      res.json(healthResult)
    } else {
      res.status(500).json(healthResult)
    }
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// Detailed system health
router.get('/system', async (req: Request, res: Response) => {
  try {
    const dbManager = DatabaseManager.getInstance()
    const dbHealth = await dbManager.healthCheck()

    res.json({
      status: dbHealth.status === 'OK' ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        server: {
          status: 'OK',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          pid: process.pid,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router
