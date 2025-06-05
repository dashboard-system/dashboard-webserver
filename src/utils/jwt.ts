// src/utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../shared/types/auth";

// Ensure we have a valid secret
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn(
      "⚠️  JWT_SECRET not found in environment variables. Using default secret."
    );
    return "fallback-secret-key-please-set-jwt-secret-in-env";
  }
  return secret;
};

// const JWT_SECRET = getJwtSecret();
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key"; // Ensure this is a string
const JWT_EXPIRES_IN: string = "1h"; // Example: '1h' for 1 hour, '7d' for 7 days, or a number for seconds

export class JWTUtils {
  // Generate JWT token
  static generateToken(payload: {
    id: number;
    email: string;
    role: string;
  }): string {
    try {
      return jwt.sign(
        payload as JwtPayload, // Explicitly type the payload
        JWT_SECRET, // Secret key as string
        {
          expiresIn: JWT_EXPIRES_IN, // Ensure this is a valid string or number
          algorithm: "HS256",
        } as SignOptions
      );
    } catch (error) {
      console.error("JWT generation error:", error);
      throw new Error("Failed to generate token");
    }
  }

  // Verify JWT token
  static verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.error("Invalid token:", error.message);
      } else if (error instanceof jwt.TokenExpiredError) {
        console.error("Token expired:", error.message);
      } else {
        console.error("Token verification error:", error);
      }
      return null;
    }
  }

  // Decode without verification (for debugging)
  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  }

  // Extract token from Authorization header
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  }
}
