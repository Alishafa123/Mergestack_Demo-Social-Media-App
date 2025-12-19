import { supabase } from "../config/supabase.js";
import { User, Profile } from "../models/index.js";
import type { CustomError, LoginCredentials, SignupCredentials, UserModel } from "../types/index.js";

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
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
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

  if (!data.user) {
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
    requiresEmailConfirmation: true,
    message: "Please check your email to confirm your account before logging in"
  };
};

export const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    const err = new Error("Refresh token is required") as CustomError;
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    const err = new Error("Invalid or expired refresh token") as CustomError;
    err.status = 401;
    throw err;
  }

  return {
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
  };
};

export const handleEmailConfirmation = async (userId: string, email: string, name: string) => {
  try {
    const existingUser = await User.findByPk(userId);
    
    if (existingUser) {
      console.log('User already exists in database:', userId);
      return { success: true, message: 'User already exists' };
    }

    await User.create({
      id: userId,
      email: email,
      name: name
    });

    await Profile.create({
      user_id: userId,
      first_name: name.split(' ')[0] || null,
      last_name: name.split(' ').slice(1).join(' ') || null
    });

    console.log('User and profile created after email confirmation:', userId);
    return { success: true, message: 'User created successfully' };
  } catch (error: any) {
    console.error('Error creating user after email confirmation:', error);
    throw error;
  }
};
