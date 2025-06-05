// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.get("/api/users", (req: Request, res: Response): void => {
  // Example route with query parameters
  const { page = "1", limit = "10" } = req.query;

  res.json({
    users: [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ],
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: 2,
    },
  });
});

app.post("/api/users", (req: Request, res: Response): void => {
  const { name, email } = req.body;

  // Basic validation
  if (!name || !email) {
    res.status(400).json({
      error: "Name and email are required",
    });
    return;
  }

  // Simulate creating user
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json(newUser);
});

// Get single user by ID
app.get("/api/users/:id", (req: Request, res: Response): void => {
  const { id } = req.params;

  // Simulate finding user
  const user = {
    id: parseInt(id),
    name: "John Doe",
    email: "john@example.com",
  };

  res.json(user);
});

// Global error handler (must be before 404 handler)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack);

  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler - should be last
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

///====
import jwt from "jsonwebtoken";

// Define constants with explicit types
const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key"; // Ensure this is a string
const JWT_EXPIRES_IN: number = 1; // Valid string format for expiresIn

// Define the payload interface for type safety
interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Sample payload
const payload: JwtPayload = {
  id: "123",
  email: "123", // Consider using a valid email format in production
  role: "1",
};

// Sign the JWT with explicit options typing
import { SignOptions } from "jsonwebtoken";

const options: SignOptions = {
  expiresIn: JWT_EXPIRES_IN, // Explicitly typed as string
  algorithm: "HS256", // Specify algorithm to narrow down overloads
};

try {
  const token = jwt.sign(payload, JWT_SECRET, options);
  console.log("Generated JWT:", token);
} catch (error) {
  console.error("Error signing JWT:", error);
}
