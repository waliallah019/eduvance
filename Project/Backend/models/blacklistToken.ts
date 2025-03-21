import mongoose, { Document, Schema, Model } from "mongoose";

import IBlacklistedToken from "../interface/blacklistToken.interface";

// Define the schema
const blacklistSchema: Schema<IBlacklistedToken> = new Schema(
  {
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 }, // Expires after 1 hour (3600 seconds)
  },
  { timestamps: true }
);

// Create the model
const BlacklistedToken: Model<IBlacklistedToken> = mongoose.model<IBlacklistedToken>("BlacklistedToken", blacklistSchema);

export default BlacklistedToken;
