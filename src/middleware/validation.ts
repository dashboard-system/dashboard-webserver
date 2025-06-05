// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';

// Validate user data for creation/update
export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    res.status(400).json({
      error: 'Name and email are required'
    });
    return;
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      error: 'Invalid email format'
    });
    return;
  }
  
  // Name validation
  if (name.length < 2) {
    res.status(400).json({
      error: 'Name must be at least 2 characters long'
    });
    return;
  }
  
  next();
};

// Validate login data
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({
      error: 'Email and password are required'
    });
    return;
  }
  
  next();
};