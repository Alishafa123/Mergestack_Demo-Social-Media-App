import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import type { JWTPayload } from "../types/index.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const signToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);
