// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { AuthRequest } from '../shared/types/auth';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = JWTUtils.extractTokenFromHeader(authHeader);

  if (!token) {
    res.status(401).json({
      error: 'Access token required'
    });
    return;
  }

  const decoded = JWTUtils.verifyToken(token);

  if (!decoded) {
    res.status(403).json({
      error: 'Invalid or expired token'
    });
    return;
  }

  req.user = decoded;
  next();
};

// Middleware to check if user has required role
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = JWTUtils.extractTokenFromHeader(authHeader);

  if (token) {
    const decoded = JWTUtils.verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};