import mongoose, { Schema, Document, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../interface/user.interface";


const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "finance-manager", "student","non-teaching-staff"], required: true }
});

// Hash password before saving user
UserSchema.pre("save", async function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

// Prevent model overwrite error
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "Users");

export default User;