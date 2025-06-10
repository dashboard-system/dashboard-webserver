// src/types/auth.ts (Simplified without email)
import { Request } from 'express';

export interface User {
  id: number;
  username: string;
  role: 'engineer' | 'maintainer' | 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface JwtPayload {
  id: number;
  username: string;
  role: 'engineer' | 'maintainer' | 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role?: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  username?: string;
  password?: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}