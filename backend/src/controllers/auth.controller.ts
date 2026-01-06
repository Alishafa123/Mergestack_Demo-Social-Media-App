import { Request, Response, NextFunction } from 'express';

import * as authService from '@services/auth.service';
import { AUTH_ERRORS, GENERIC_ERRORS } from '@constants/errors';
import type { LoginCredentials, SignupCredentials } from '@/types/index';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginCredentials = req.body;
    const result = await authService.login({ email, password });
    return res.json({
      success: true,
      user: result.user,
      profile: result.profile,
      token: result.token,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresAt,
    });
  } catch (err) {
    next(err);
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name }: SignupCredentials = req.body;
    const result = await authService.signup({ email, password, name });

    return res.status(201).json({
      success: true,
      requiresEmailConfirmation: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return res.json({
      success: true,
      token: result.token,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresAt,
    });
  } catch (err) {
    next(err);
  }
};

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, record } = req.body;

    if (type === 'INSERT' && record.email_confirmed_at) {
      const userId = record.id;
      const email = record.email;
      const name = record.raw_user_meta_data?.name || email.split('@')[0];

      await authService.handleEmailConfirmation(userId, email, name);

      return res.json({ success: true });
    }

    return res.json({ success: true, message: GENERIC_ERRORS.EVENT_NOT_HANDLED });
  } catch (err) {
    console.error('Webhook error:', err);
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`;

    const result = await authService.requestPasswordReset(email, redirectUrl);

    return res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, refresh_token } = req.body;
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      const err = new Error(AUTH_ERRORS.AUTHORIZATION_TOKEN_REQUIRED) as any;
      err.status = 401;
      throw err;
    }

    const result = await authService.resetPassword(accessToken, password, refresh_token);

    return res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
