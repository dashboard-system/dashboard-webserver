import { Router, Request, Response } from "express";
import { JWTUtils } from "../utils/jwt";
import { authenticateToken } from "../middleware/auth";
import { UserModel } from "../shared/models/user";
import { AuthRequest } from "../shared/types/auth";

const router = Router();
const userModel = new UserModel();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        error: 'Username and password are required'
      });
      return;
    }

    // Verify user credentials
    const user = await userModel.verifyPassword(username, password);
    if (!user) {
      res.status(401).json({
        error: 'Invalid credentials'
      });
      return;
    }

    // Generate JWT token
    const token = JWTUtils.generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        error: 'Username and password are required'
      });
      return;
    }

    // Username validation
    if (username.length < 3) {
      res.status(400).json({
        error: 'Username must be at least 3 characters long'
      });
      return;
    }

    // Password validation
    if (password.length < 6) {
      res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
      return;
    }

    // Role validation
    const validRoles = ['user', 'engineer', 'maintainer', 'admin'];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        error: 'Invalid role specified'
      });
      return;
    }

    // Create user
    const newUser = await userModel.createUser({
      username,
      password,
      role
    });

    // Generate token
    const token = JWTUtils.generateToken({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'Username already exists') {
      res.status(409).json({
        error: error.message
      });
      return;
    }
    
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not found in token'
      });
      return;
    }

    // Get full user data from database
    const user = userModel.getUserById(req.user.id);
    if (!user) {
      res.status(404).json({
        error: 'User not found'
      });
      return;
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// POST /api/auth/refresh - Refresh token
router.post('/refresh', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Invalid token'
      });
      return;
    }

    // Verify user still exists in database
    const user = userModel.getUserById(req.user.id);
    if (!user) {
      res.status(404).json({
        error: 'User no longer exists'
      });
      return;
    }

    // Generate new token
    const newToken = JWTUtils.generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// PUT /api/auth/profile - Update own profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not found in token'
      });
      return;
    }

    const { username, password } = req.body;
    const updateData: any = {};

    if (username) {
      if (username.length < 3) {
        res.status(400).json({
          error: 'Username must be at least 3 characters long'
        });
        return;
      }
      updateData.username = username;
    }

    if (password) {
      if (password.length < 6) {
        res.status(400).json({
          error: 'Password must be at least 6 characters long'
        });
        return;
      }
      updateData.password = password;
    }

    // Update user
    const updatedUser = await userModel.updateUser(req.user.id, updateData);
    if (!updatedUser) {
      res.status(404).json({
        error: 'User not found'
      });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        updated_at: updatedUser.updated_at
      }
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    
    if (error.message === 'Username already exists') {
      res.status(409).json({
        error: error.message
      });
      return;
    }
    
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req: AuthRequest, res: Response): void => {
  // In a real app with Redis, you might want to blacklist the token
  // For now, just return success
  res.json({
    message: 'Logout successful'
  });
});

export default router;