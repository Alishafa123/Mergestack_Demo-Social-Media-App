import { supabase } from "@config/supabase.js";
import { User, Profile } from "@models/index.js";
import type { CustomError, LoginCredentials, SignupCredentials } from "@/types/index";

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

// Request password reset - sends email with reset link
export const requestPasswordReset = async (email: string, redirectUrl: string) => {
  if (!email) {
    const err = new Error("Email is required") as CustomError;
    err.status = 400;
    throw err;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error('Password reset request error:', error);
    const err = new Error("Failed to send password reset email") as CustomError;
    err.status = 400;
    throw err;
  }

  return {
    success: true,
    message: "If an account exists with this email, you will receive a password reset link shortly"
  };
};

// Reset password with token from email
export const resetPassword = async (accessToken: string, newPassword: string, refreshToken?: string) => {
  if (!accessToken || !newPassword) {
    const err = new Error("Access token and new password are required") as CustomError;
    err.status = 400;
    throw err;
  }

  // Set the session with the access token from the reset link
  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken || '',
  });

  if (sessionError || !sessionData.user) {
    console.error('Session error:', sessionError);
    const err = new Error("Invalid or expired reset token") as CustomError;
    err.status = 401;
    throw err;
  }

  // Update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error('Password update error:', updateError);
    const err = new Error("Failed to update password") as CustomError;
    err.status = 400;
    throw err;
  }

  return {
    success: true,
    message: "Password updated successfully. You can now login with your new password"
  };
};
