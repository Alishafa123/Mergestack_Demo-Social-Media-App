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

  const userProfile = await Profile.findOne({
    where: { user_id: data.user.id }
  });

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || data.user.email!.split('@')[0]
    },
    profile: userProfile ? userProfile.toJSON() : null,
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

  let profile = null;
  
  try {
    await User.create({
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || name
    });

    profile = await Profile.create({
      user_id: data.user.id,
      first_name: (data.user.user_metadata?.name || name).split(' ')[0] || null,
      last_name: (data.user.user_metadata?.name || name).split(' ').slice(1).join(' ') || null
    });

    console.log('Profile created successfully:', profile.toJSON());
    
  } catch (dbError: any) {
    console.error('Error saving user to custom table:', dbError);
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || name
    },
    profile: profile ? profile.toJSON() : null,
    token: data.session.access_token,
  };
};
