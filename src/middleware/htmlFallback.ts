// src/middleware/htmlFallback.ts
import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'

interface HTMLFallbackOptions {
  uiDistPath: string
  apiPrefixes?: string[]
  indexFile?: string
}

export class HTMLFallbackMiddleware {
  private uiDistPath: string
  private apiPrefixes: string[]
  private indexFile: string
  private indexFilePath: string

  constructor(options: HTMLFallbackOptions) {
    this.uiDistPath = options.uiDistPath
    this.apiPrefixes = options.apiPrefixes || ['/api/', '/health']
    this.indexFile = options.indexFile || 'index.html'
    this.indexFilePath = path.join(this.uiDistPath, this.indexFile)
    
    // Validate that the index file exists
    this.validateIndexFile()
  }

  private validateIndexFile(): void {
    if (!fs.existsSync(this.indexFilePath)) {
      console.warn(`⚠️  HTML fallback file not found at: ${this.indexFilePath}`)
      console.warn('   UI routes will return 404 until the UI is built')
    }
  }

  private isApiRoute(path: string): boolean {
    return this.apiPrefixes.some(prefix => path.startsWith(prefix))
  }

  private isStaticAsset(path: string): boolean {
    const ext = path.split('.').pop()
    const staticExtensions = ['js', 'css', 'ico', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'woff', 'woff2', 'ttf', 'eot']
    return staticExtensions.includes(ext?.toLowerCase() || '')
  }

  /**
   * Middleware for handling HTML fallback routing
   */
  public handler = (req: Request, res: Response, next: NextFunction): void => {
    // Skip if it's an API route
    if (this.isApiRoute(req.path)) {
      res.status(404).json({
        success: false,
        error: 'API route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      })
      return
    }

    // Skip if it's a static asset that doesn't exist (let express.static handle it)
    if (this.isStaticAsset(req.path)) {
      next()
      return
    }

    // Only handle GET requests for HTML fallback routes
    if (req.method !== 'GET') {
      next()
      return
    }

    // Check if index.html exists before serving
    if (!fs.existsSync(this.indexFilePath)) {
      res.status(503).json({
        success: false,
        error: 'UI not available',
        message: 'The user interface has not been built yet. Please run "npm run build" in the ui directory.',
        path: req.originalUrl
      })
      return
    }

    // Serve index.html for HTML fallback routes
    res.sendFile(this.indexFilePath, (err) => {
      if (err) {
        console.error('Error serving HTML fallback file:', err)
        res.status(500).json({
          success: false,
          error: 'Failed to serve UI',
          message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        })
      }
    })
  }

  /**
   * Express route handler for catch-all HTML fallback routes
   */
  public static create(options: HTMLFallbackOptions) {
    const middleware = new HTMLFallbackMiddleware(options)
    return middleware.handler
  }
}

export default HTMLFallbackMiddleware