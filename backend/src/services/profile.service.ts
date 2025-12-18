import { User, Profile, Post, UserFollow } from "../models/index.js";
import type { CustomError, UserModel } from "../types/index.js";
import { StorageService } from "./storage.service.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";

export const getProfile = async (userId: string): Promise<UserModel> => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [{
        model: Profile,
        as: 'profile'
      }]
    }) as UserModel | null;

    if (!user) {
      const err = new Error("User not found") as CustomError;
      err.status = 404;
      throw err;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userId: string, profileData: any): Promise<UserModel> => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [{
        model: Profile,
        as: 'profile'
      }]
    }) as UserModel | null;

    if (!user) {
      const err = new Error("User not found") as CustomError;
      err.status = 404;
      throw err;
    }

    if (profileData.profile_url && user.profile?.profile_url) {
      await StorageService.deleteProfileImage(user.profile.profile_url);
    }

    const [updatedRowsCount] = await Profile.update(profileData, {
      where: { user_id: userId }
    });

    if (updatedRowsCount === 0) {
      await Profile.create({
        user_id: userId,
        ...profileData
      });
    }

    return await getProfile(userId);
  } catch (error) {
    throw error;
  }
};

export const deleteProfile = async (userId: string): Promise<{ message: string }> => {
  try {
    const user = await User.findOne({
      where: { id: userId }
    }) as UserModel | null;

    if (!user) {
      const err = new Error("User not found") as CustomError;
      err.status = 404;
      throw err;
    }

    await User.destroy({
      where: { id: userId }
    });

    return { message: "Profile deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export const getUserStats = async (userId: string) => {
  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      const err = new Error("User not found") as CustomError;
      err.status = 404;
      throw err;
    }

    const postStats = await Post.findOne({
      where: { user_id: userId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('likes_count')), 'totalLikes'],
        [sequelize.fn('SUM', sequelize.col('comments_count')), 'totalComments'],
        [sequelize.fn('SUM', sequelize.col('shares_count')), 'totalShares'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalPosts']
      ],
      raw: true
    }) as any;

    const [followersCount, followingCount] = await Promise.all([
      UserFollow.count({ where: { following_id: userId } }),
      UserFollow.count({ where: { follower_id: userId } })
    ]);

    return {
      totalLikes: parseInt(postStats?.totalLikes) || 0,
      totalComments: parseInt(postStats?.totalComments) || 0,
      totalShares: parseInt(postStats?.totalShares) || 0,
      totalPosts: parseInt(postStats?.totalPosts) || 0,
      followersCount,
      followingCount
    };
  } catch (error) {
    throw error;
  }
};

