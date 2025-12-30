import { Request, Response, NextFunction } from 'express';

import type { AuthenticatedRequest } from '@/types/express.js';
import * as commentService from '@services/comment.service.js';

export const createComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot exceed 1000 characters',
      });
    }

    const comment = await commentService.createComment(postId, userId, content.trim(), parentCommentId);

    res.status(201).json({
      success: true,
      message: parentCommentId ? 'Reply added successfully' : 'Comment added successfully',
      comment,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getPostComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    const result = await commentService.getPostComments(postId, page, limit);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID is required',
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot exceed 1000 characters',
      });
    }

    const comment = await commentService.updateComment(commentId, userId, content.trim());

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID is required',
      });
    }

    const result = await commentService.deleteComment(commentId, userId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};
