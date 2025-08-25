// src/routes/users.ts
import { Router, Response } from 'express'
import { authenticateToken, requireRole } from '../middleware/auth'
import { AuthRequest } from '../shared/types/auth'
import { UserModel } from '../shared/models/user'

const router = Router()
const userModel = new UserModel()

// Apply authentication to all user routes
router.use(authenticateToken)

// GET /api/users - Get all users (admin only)
router.get(
  '/',
  requireRole(['admin']),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { page = '1', limit = '10', search } = req.query
      const pageNum = parseInt(page as string)
      const limitNum = parseInt(limit as string)

      const { users, total } = await userModel.getAllUsers(
        pageNum,
        limitNum,
        search as string
      )

      res.json({
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      })
    } catch (error) {
      console.error('Get users error:', error)
      res.status(500).json({
        error: 'Internal server error',
      })
    }
  },
)

// GET /api/users/profile - Get own profile
router.get('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not found in token',
      })
      return
    }

    const user = await userModel.getUserById(req.user.id)

    if (!user) {
      res.status(404).json({
        error: 'User not found',
      })
      return
    }

    res.json(user)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})

// GET /api/users/:id - Get user by ID (admin only)
router.get(
  '/:id',
  requireRole(['admin']),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const userId = parseInt(id)

      if (isNaN(userId)) {
        res.status(400).json({
          error: 'Invalid user ID',
        })
        return
      }

      const user = await userModel.getUserById(userId)

      if (!user) {
        res.status(404).json({
          error: 'User not found',
          id: userId,
        })
        return
      }

      res.json(user)
    } catch (error) {
      console.error('Get user by ID error:', error)
      res.status(500).json({
        error: 'Internal server error',
      })
    }
  },
)

export default router
