import User from "../models/User";
import generateToken from "../utils/generateToken";
import BlacklistedToken from "../models/blacklistToken"; // New model for blacklisted tokens
import {hashPassword, comparePassword} from "../utils/hashPassword";
import { Request, Response } from "express";

class AuthController {
  async register(req: Request, res: Response) {
    const { username, email, password, role } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await hashPassword(password); // Hash the password
      const user = await User.create({ username, email, password: hashedPassword, role });

      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  async login(req: Request, res: Response) {
    const { username, email, password } = req.body;
    try {
      const user = await User.findOne({ $or: [{ email }, { username }] });
      // if (user && (await bcrypt.compare(password, user.password)))
      if (user && (await comparePassword(password, user.password))) {
        res.json({
          _id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user.id),
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = req.header("Authorization");
      if (!token) return res.status(400).json({ message: "No token provided" });

      // Blacklist the token by saving it to the database
      await BlacklistedToken.create({ token });

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new AuthController();
export default AuthController;