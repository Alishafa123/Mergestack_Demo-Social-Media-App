import { supabase } from '@config/supabase';
import { User, Profile } from '@models/index';
import { AUTH_ERRORS, SUCCESS_MESSAGES } from '@constants/errors';
import type { CustomError, LoginCredentials, SignupCredentials } from '@/types/index';

export const login = async ({ email, password }: LoginCredentials) => {
  if (!email || !password) {
    const err = new Error(AUTH_ERRORS.EMAIL_PASSWORD_REQUIRED) as CustomError;
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const err = new Error(AUTH_ERRORS.INVALID_CREDENTIALS) as CustomError;
    err.status = 401;
    throw err;
  }

  if (!data.user || !data.session) {
    const err = new Error(AUTH_ERRORS.AUTHENTICATION_FAILED) as CustomError;
    err.status = 401;
    throw err;
  }

  const userProfile = await Profile.findOne({
    where: { user_id: data.user.id },
  });

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
    },
    profile: userProfile ? userProfile.toJSON() : null,
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
  };
};

export const signup = async ({ email, password, name }: SignupCredentials) => {
  if (!email || !password || !name) {
    const err = new Error(AUTH_ERRORS.EMAIL_PASSWORD_NAME_REQUIRED) as CustomError;
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      const err = new Error(AUTH_ERRORS.USER_ALREADY_EXISTS) as CustomError;
      err.status = 409;
      throw err;
    }
    const err = new Error(error.message) as CustomError;
    err.status = 400;
    throw err;
  }

  if (!data.user) {
    const err = new Error(AUTH_ERRORS.REGISTRATION_FAILED) as CustomError;
    err.status = 400;
    throw err;
  }

  return {
    requiresEmailConfirmation: true,
    message: SUCCESS_MESSAGES.EMAIL_CONFIRMATION_REQUIRED,
  };
};

export const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    const err = new Error(AUTH_ERRORS.REFRESH_TOKEN_REQUIRED) as CustomError;
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    const err = new Error(AUTH_ERRORS.INVALID_REFRESH_TOKEN) as CustomError;
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
      return { success: true, message: SUCCESS_MESSAGES.USER_ALREADY_EXISTS_MESSAGE };
    }

    await User.create({
      id: userId,
      email: email,
      name: name,
    });

    await Profile.create({
      user_id: userId,
      first_name: name.split(' ')[0] || null,
      last_name: name.split(' ').slice(1).join(' ') || null,
    });

    console.log('User and profile created after email confirmation:', userId);
    return { success: true, message: SUCCESS_MESSAGES.USER_CREATED };
  } catch (error: any) {
    console.error('Error creating user after email confirmation:', error);
    throw error;
  }
};

// Request password reset - sends email with reset link
export const requestPasswordReset = async (email: string, redirectUrl: string) => {
  if (!email) {
    const err = new Error(AUTH_ERRORS.EMAIL_REQUIRED) as CustomError;
    err.status = 400;
    throw err;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error('Password reset request error:', error);
    const err = new Error(AUTH_ERRORS.PASSWORD_RESET_FAILED) as CustomError;
    err.status = 400;
    throw err;
  }

  return {
    success: true,
    message: SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
  };
};

// Reset password with token from email
export const resetPassword = async (accessToken: string, newPassword: string, refreshToken?: string) => {
  if (!accessToken || !newPassword) {
    const err = new Error(AUTH_ERRORS.ACCESS_TOKEN_PASSWORD_REQUIRED) as CustomError;
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
    const err = new Error(AUTH_ERRORS.INVALID_RESET_TOKEN) as CustomError;
    err.status = 401;
    throw err;
  }

  // Update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error('Password update error:', updateError);
    const err = new Error(AUTH_ERRORS.PASSWORD_UPDATE_FAILED) as CustomError;
    err.status = 400;
    throw err;
  }

  return {
    success: true,
    message: SUCCESS_MESSAGES.PASSWORD_UPDATED,
  };
};
