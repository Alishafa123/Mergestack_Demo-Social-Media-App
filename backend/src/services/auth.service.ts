import { supabase } from "../config/supabase.js";
import type { CustomError, LoginCredentials, SignupCredentials } from "../types/index.js";

export const login = async ({ email, password }: LoginCredentials) => {
  if (!email || !password) {
    const err = new Error("Email and password are required") as CustomError;
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const err = new Error("Invalid credentials") as CustomError;
    err.status = 401;
    throw err;
  }

  if (!data.user || !data.session) {
    const err = new Error("Authentication failed") as CustomError;
    err.status = 401;
    throw err;
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || data.user.email!.split('@')[0]
    },
    token: data.session.access_token,
  };
};

export const signup = async ({ email, password, name }: SignupCredentials) => {
  if (!email || !password || !name) {
    const err = new Error("Email, password, and name are required") as CustomError;
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name
      }
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      const err = new Error("User already exists with this email") as CustomError;
      err.status = 409;
      throw err;
    }
    const err = new Error(error.message) as CustomError;
    err.status = 400;
    throw err;
  }

  if (!data.user || !data.session) {
    const err = new Error("Registration failed") as CustomError;
    err.status = 400;
    throw err;
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || name
    },
    token: data.session.access_token,
  };
};
