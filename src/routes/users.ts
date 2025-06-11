// src/routes/users.ts
import { Router, Response } from 'express'
import { authenticateToken, requireRole } from '../middleware/auth'
import { AuthRequest, User } from '../shared/types/auth'

const router = Router()

// Apply authentication to all user routes
router.use(authenticateToken)

// Mock data
let users: User[] = [
  {
    id: 1,
    username: 'John Doe',
    role: 'user',
    updated_at: '2024-01-02T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'Jane Smith',
    role: 'user',
    updated_at: '2024-01-02T00:00:00Z',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    username: 'Bob Johnson',
    role: 'admin',
    updated_at: '2024-01-02T00:00:00Z',
    created_at: '2024-01-03T00:00:00Z',
  },
]

// GET /api/users - Get all users (admin only)
router.get(
  '/',
  requireRole(['admin']),
  (req: AuthRequest, res: Response): void => {
    const { page = '1', limit = '10', search } = req.query
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)

    let filteredUsers = users

    if (search) {
      filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes((search as string).toLowerCase()),
      )
    }

    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    res.json({
      users: paginatedUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limitNum),
      },
    })
  },
)

// GET /api/users/profile - Get own profile
router.get('/profile', (req: AuthRequest, res: Response): void => {
  const user = users.find((u) => u.id === req.user!.id)

  if (!user) {
    res.status(404).json({
      error: 'User not found',
    })
    return
  }

  res.json(user)
})

// GET /api/users/:id - Get user by ID (admin only)
router.get(
  '/:id',
  requireRole(['admin']),
  (req: AuthRequest, res: Response): void => {
    const { id } = req.params
    const userId = parseInt(id)

    const user = users.find((u) => u.id === userId)

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        id: userId,
      })
      return
    }

    res.json(user)
  },
)

export default router
