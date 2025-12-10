import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.util.js";
import type { CustomError, LoginCredentials, SignupCredentials } from "../types/index.js";

export const login = async ({ email, password }: LoginCredentials) => {
  if (!email || !password) {
    const err = new Error("Email and password are required") as CustomError;
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({ where: { email } });
  console.log(email);
  if (!user) {
    const err = new Error("Invalid credentials") as CustomError;
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, (user as any).password);
  if (!isMatch) {
    const err = new Error("Invalid credentials") as CustomError;
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: (user as any).id, email: (user as any).email });

  return {
    user: {
      id: (user as any).id,
      email: (user as any).email,
      name: (user as any).name
    },
    token,
  };
};

export const signup = async ({ email, password, name }: SignupCredentials) => {
  if (!email || !password || !name) {
    const err = new Error("Email, password, and name are required") as CustomError;
    err.status = 400;
    throw err;
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const err = new Error("User already exists with this email") as CustomError;
    err.status = 409;
    throw err;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
  });

  const token = signToken({ id: (user as any).id, email: (user as any).email });

  return {
    user: {
      id: (user as any).id,
      email: (user as any).email,
      name: (user as any).name
    },
    token,
  };
};
