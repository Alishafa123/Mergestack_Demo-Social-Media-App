import { Request, Response, NextFunction } from 'express';

import type { AuthenticatedRequest } from '@/types/express';
import { PROFILE_ERRORS, SUCCESS_MESSAGES, GENERIC_ERRORS } from '@constants/errors';
import { uploadProfileImage } from '@services/storage.service';
import { getProfile, getUserStatsData, searchUsersByName, updateProfileData } from '@/services/profile.service';

export const getProfileData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const paramUserId = req.query?.userId as string | undefined;
    const userId = paramUserId ?  paramUserId : req.user.id 

    const user = await getProfile(userId);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateMyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    let profileData = { ...req.body };

    if (!req.file) {
      delete profileData.profile_url;
    }

    if (req.file) {
      try {
        const imageUrl = await uploadProfileImage(userId, req.file);
        profileData.profile_url = imageUrl;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: PROFILE_ERRORS.PROFILE_IMAGE_UPLOAD_FAILED,
          error: uploadError instanceof Error ? uploadError.message : GENERIC_ERRORS.UNKNOWN_UPLOAD_ERROR,
        });
      }
    }

    const user = await updateProfileData(userId, profileData);

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const stats = await getUserStatsData(userId);

    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    next(error);
  }
};

export const searchUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { q: query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const currentUserId = req.user.id;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: PROFILE_ERRORS.SEARCH_QUERY_REQUIRED,
      });
    }

    if (query.length < 2) {
      return res.status(400).json({
        success: false,
        message: PROFILE_ERRORS.SEARCH_QUERY_TOO_SHORT,
      });
    }

    const result = await searchUsersByName(query.trim(), page, limit, currentUserId);

    res.json({
      success: true,
      query: query.trim(),
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};
