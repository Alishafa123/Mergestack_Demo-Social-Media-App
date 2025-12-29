import { Request, Response, NextFunction } from 'express';

import * as shareService from '@services/share.service.js';
import type { AuthenticatedRequest } from '@/types/express.js';

export const sharePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const { postId } = req.params;
    const { sharedContent } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    if (sharedContent && sharedContent.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Share message cannot exceed 500 characters',
      });
    }

    const share = await shareService.sharePost(postId, userId, sharedContent);

    res.status(201).json({
      success: true,
      message: 'Post shared successfully',
      share,
    });
  } catch (error: any) {
    next(error);
  }
};

export const unsharePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    const result = await shareService.unsharePost(postId, userId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};
