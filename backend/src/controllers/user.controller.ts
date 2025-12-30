import { Request, Response, NextFunction } from 'express';

import { USER_ERRORS } from '@constants/errors';
import * as userService from '@services/user.service';
import type { AuthenticatedRequest } from '@/types/express';

export const followUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: USER_ERRORS.USER_ID_REQUIRED,
      });
    }

    const result = await userService.followUser(followerId, followingId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const unfollowUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: USER_ERRORS.USER_ID_REQUIRED,
      });
    }

    const result = await userService.unfollowUser(followerId, followingId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: USER_ERRORS.USER_ID_REQUIRED,
      });
    }

    const result = await userService.getFollowers(userId, page, limit);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const checkFollowStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: USER_ERRORS.USER_ID_REQUIRED,
      });
    }

    const isFollowing = await userService.isFollowing(followerId, followingId);

    res.json({
      success: true,
      isFollowing,
    });
  } catch (error: any) {
    next(error);
  }
};
