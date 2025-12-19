import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.service.js";
import { StorageService } from "../services/storage.service.js";

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; 
    
    const user = await profileService.getProfile(userId);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    let profileData = { ...req.body };

    if (!req.file) {
      delete profileData.profile_url;
    }

    if (req.file) {
      try {
        const imageUrl = await StorageService.uploadProfileImage(userId, req.file);
        profileData.profile_url = imageUrl;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload profile image",
          error: uploadError instanceof Error ? uploadError.message : "Unknown upload error"
        });
      }
    }
    
    const user = await profileService.updateProfile(userId, profileData);
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    const result = await profileService.deleteProfile(userId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await profileService.getProfile(userId);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    let profileData = { ...req.body };

    // Remove profile_url from form data if no file is uploaded
    if (!req.file) {
      delete profileData.profile_url;
    }

    // Handle profile image upload if file is present
    if (req.file) {
      try {
        const imageUrl = await StorageService.uploadProfileImage(userId, req.file);
        profileData.profile_url = imageUrl;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload profile image",
          error: uploadError instanceof Error ? uploadError.message : "Unknown upload error"
        });
      }
    }

    const user = await profileService.updateProfile(userId, profileData);
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await profileService.deleteProfile(userId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q: query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const currentUserId = req.user?.id;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    if (query.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters"
      });
    }

    const result = await profileService.searchUsersByName(
      query.trim(),
      page,
      limit,
      currentUserId
    );

    res.json({
      success: true,
      query: query.trim(),
      ...result
    });
  } catch (error: any) {
    next(error);
  }
};