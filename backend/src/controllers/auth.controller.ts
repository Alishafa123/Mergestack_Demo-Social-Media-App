import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import type { LoginCredentials, SignupCredentials } from "../types/index.js";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginCredentials = req.body;
    const result = await authService.login({ email, password });
    return res.json({
      success: true,
      user: result.user,
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
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresAt,
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
