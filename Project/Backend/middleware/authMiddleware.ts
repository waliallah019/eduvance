import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import BlacklistedToken from "../models/blacklistToken";

// Extend Request type to include user property
interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access Denied" });

  try {
    // Check if the token is blacklisted
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token has been revoked. Please log in again." });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not defined" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default verifyToken;
