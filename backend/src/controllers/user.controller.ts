import { Request, Response, NextFunction } from "express";

import * as userService from "@services/user.service.js";

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user!.id;
    const followingId = req.params.userId;

    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await userService.followUser(followerId, followingId);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};

export const unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user!.id;
    const followingId = req.params.userId;

    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await userService.unfollowUser(followerId, followingId);

    res.json({
      success: true,
      ...result
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
        message: "User ID is required"
      });
    }

    const result = await userService.getFollowers(userId, page, limit);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};

export const getFollowing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await userService.getFollowing(userId, page, limit);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};

export const checkFollowStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user!.id;
    const followingId = req.params.userId;

    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const isFollowing = await userService.isFollowing(followerId, followingId);

    res.json({
      success: true,
      isFollowing
    });
  } catch (error: any) {
    next(error);
  }
};

export const getFollowStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const stats = await userService.getFollowStats(userId);

    res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    next(error);
  }
};

export const getUsersToFollow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await userService.getUsersToFollow(currentUserId, page, limit);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};