import { Request, Response, NextFunction } from 'express';

import * as postService from '@services/post.service.js';
import { StorageService } from '@services/storage.service.js';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { content } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!content && (!files || files.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Post must have either content or images',
      });
    }

    let imageUrls: string[] = [];

    // Upload images if any
    if (files && files.length > 0) {
      try {
        imageUrls = await StorageService.uploadPostImages(userId, 'temp', files);
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Failed to upload post images',
          error: uploadError instanceof Error ? uploadError.message : 'Unknown upload error',
        });
      }
    }

    const completePost = await postService.createPost(userId, content, imageUrls);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: completePost,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query.userId as string;
    const currentUserId = req.user!.id;

    const result = await postService.getPosts(page, limit, userId, currentUserId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    const post = await postService.getPost(postId);

    res.json({
      success: true,
      post,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const postId = req.params.postId;
    const { content } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    const post = await postService.updatePost(postId, userId, content);

    res.json({
      success: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    const result = await postService.deletePost(postId, userId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    const result = await postService.toggleLike(postId, userId);

    res.json({
      success: true,
      message: result.liked ? 'Post liked' : 'Post unliked',
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getTrendingPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const currentUserId = req.user!.id;

    const result = await postService.getTrendingPosts(page, limit, currentUserId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getUserTopPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const result = await postService.getUserTopPosts(userId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getFollowersFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await postService.getFollowersFeed(userId, page, limit);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};
