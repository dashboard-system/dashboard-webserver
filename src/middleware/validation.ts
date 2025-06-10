// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';

// Validate user data for creation/update
export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email } = req.body;
  
  if (!name ) {
    res.status(400).json({
      error: 'Name is required'
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
  const { username, password } = req.body;
  
  if (!username || !password) {
    res.status(400).json({
      error: 'Username and password are required'
    });
    return;
  }
  
  next();
};