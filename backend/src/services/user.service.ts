import { Op } from 'sequelize';

import type { CustomError } from '@/types/index';
import { User, Profile, UserFollow } from '@models/index.js';
import { USER_ERRORS, SUCCESS_MESSAGES } from '@constants/errors.js';

export const followUser = async (
  followerId: string,
  followingId: string,
): Promise<{ message: string; isFollowing: boolean }> => {
  try {
    if (followerId === followingId) {
      const err = new Error(USER_ERRORS.CANNOT_FOLLOW_YOURSELF) as CustomError;
      err.status = 400;
      throw err;
    }

    const targetUser = await User.findByPk(followingId);
    if (!targetUser) {
      const err = new Error(USER_ERRORS.USER_NOT_FOUND) as CustomError;
      err.status = 404;
      throw err;
    }

    const existingFollow = await UserFollow.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });

    if (existingFollow) {
      const err = new Error(USER_ERRORS.ALREADY_FOLLOWING) as CustomError;
      err.status = 400;
      throw err;
    }

    await UserFollow.create({
      follower_id: followerId,
      following_id: followingId,
    });

    return { message: SUCCESS_MESSAGES.USER_FOLLOWED, isFollowing: true };
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (
  followerId: string,
  followingId: string,
): Promise<{ message: string; isFollowing: boolean }> => {
  try {
    const followRelation = await UserFollow.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });

    if (!followRelation) {
      const err = new Error(USER_ERRORS.NOT_FOLLOWING) as CustomError;
      err.status = 400;
      throw err;
    }

    await followRelation.destroy();

    return { message: SUCCESS_MESSAGES.USER_UNFOLLOWED, isFollowing: false };
  } catch (error) {
    throw error;
  }
};

export const getFollowers = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ followers: any[]; total: number; hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await UserFollow.findAndCountAll({
      where: { following_id: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['first_name', 'last_name', 'profile_url', 'bio'],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      followers: rows.map((row) => row.toJSON()),
      total: count,
      hasMore: offset + limit < count,
    };
  } catch (error) {
    throw error;
  }
};

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    const followRelation = await UserFollow.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });

    return !!followRelation;
  } catch (error) {
    throw error;
  }
};
