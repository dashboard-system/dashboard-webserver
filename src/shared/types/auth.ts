// src/types/auth.ts
import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}