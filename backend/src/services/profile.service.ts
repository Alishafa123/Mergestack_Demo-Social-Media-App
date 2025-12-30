import { Op } from 'sequelize';

import sequelize from '@config/database';
import type { CustomError, UserModel } from '@/types/index';
import { deleteProfileImage } from '@services/storage.service';
import { User, Profile, Post, UserFollow } from '@models/index';
import { PROFILE_ERRORS } from '@constants/errors';

export const getProfile = async (userId: string): Promise<UserModel> => {
  try {
    const user = (await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Profile,
          as: 'profile',
        },
      ],
    })) as UserModel | null;

    if (!user) {
      const err = new Error(PROFILE_ERRORS.USER_NOT_FOUND) as CustomError;
      err.status = 404;
      throw err;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const updateProfileData = async (userId: string, profileData: any): Promise<UserModel> => {
  try {
    const user = (await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Profile,
          as: 'profile',
        },
      ],
    })) as UserModel | null;

    if (!user) {
      const err = new Error(PROFILE_ERRORS.USER_NOT_FOUND) as CustomError;
      err.status = 404;
      throw err;
    }

    if (profileData.profile_url && user.profile?.profile_url) {
      await deleteProfileImage(user.profile.profile_url);
    }

    const [updatedRowsCount] = await Profile.update(profileData, {
      where: { user_id: userId },
    });

    if (updatedRowsCount === 0) {
      await Profile.create({
        user_id: userId,
        ...profileData,
      });
    }

    return await getProfile(userId);
  } catch (error) {
    throw error;
  }
};

export const getUserStatsData = async (userId: string) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      const err = new Error(PROFILE_ERRORS.USER_NOT_FOUND) as CustomError;
      err.status = 404;
      throw err;
    }

    const postStats = (await Post.findOne({
      where: { user_id: userId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('likes_count')), 'totalLikes'],
        [sequelize.fn('SUM', sequelize.col('comments_count')), 'totalComments'],
        [sequelize.fn('SUM', sequelize.col('shares_count')), 'totalShares'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalPosts'],
      ],
      raw: true,
    })) as any;

    const [followersCount, followingCount] = await Promise.all([
      UserFollow.count({ where: { following_id: userId } }),
      UserFollow.count({ where: { follower_id: userId } }),
    ]);

    return {
      totalLikes: parseInt(postStats?.totalLikes) || 0,
      totalComments: parseInt(postStats?.totalComments) || 0,
      totalShares: parseInt(postStats?.totalShares) || 0,
      totalPosts: parseInt(postStats?.totalPosts) || 0,
      followersCount,
      followingCount,
    };
  } catch (error: any) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

export const searchUsersByName = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  currentUserId?: string,
): Promise<{ users: UserModel[]; total: number; hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      include: [
        {
          model: Profile,
          as: 'profile',
          where: {
            [Op.or]: [{ first_name: { [Op.iLike]: `%${query}%` } }, { last_name: { [Op.iLike]: `%${query}%` } }],
          },
          required: true,
        },
      ],
      where: {
        ...(currentUserId && { id: { [Op.ne]: currentUserId } }),
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return {
      users: rows.map((user) => user.toJSON() as UserModel),
      total: count,
      hasMore: offset + limit < count,
    };
  } catch (error) {
    throw error;
  }
};
