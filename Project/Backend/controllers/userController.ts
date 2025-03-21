import UserModel from "../models/User";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { hashPassword } from "../utils/hashPassword";
import { Request, Response } from "express";

dotenv.config();

export const getUser = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        const user = await UserModel.findOne({ 
            $or: [{ username: query }, { email: query }] 
        }).select("-password");
        
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { userId, email, newPassword } = req.body;
        const hashedPassword = await hashPassword(newPassword);

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            { password: hashedPassword },
            { new: true } // Ensures updated document is returned
        );
        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: "Password updated successfully!" });
        await sendPasswordResetEmail(email);
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (userEmail: string) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Password Reset Confirmation",
            text: "Your password has been reset successfully. If you didn't do this, please contact support immediately.",
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};