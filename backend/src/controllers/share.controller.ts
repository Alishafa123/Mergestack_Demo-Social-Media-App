import { Request, Response, NextFunction } from "express";
import * as shareService from "../services/share.service.js";

export const sharePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { postId } = req.params;
    const { sharedContent } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required"
      });
    }

    if (sharedContent && sharedContent.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Share message cannot exceed 500 characters"
      });
    }

    const share = await shareService.sharePost(postId, userId, sharedContent);

    res.status(201).json({
      success: true,
      message: "Post shared successfully",
      share
    });
  } catch (error: any) {
    next(error);
  }
};

export const unsharePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required"
      });
    }

    const result = await shareService.unsharePost(postId, userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};

export const getPostShares = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required"
      });
    }

    const result = await shareService.getPostShares(postId, page, limit);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};

export const getUserShares = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await shareService.getUserShares(userId, page, limit);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};

export const getUserTimeline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const currentUserId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await shareService.getUserTimeline(userId, page, limit, currentUserId);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};