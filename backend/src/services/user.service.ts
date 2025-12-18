import { User, Profile, UserFollow } from "../models/index.js";
import { Op } from "sequelize";
import type { CustomError } from "../types/index.js";

export const followUser = async (
  followerId: string, 
  followingId: string
): Promise<{ message: string, isFollowing: boolean }> => {
  try {
    if (followerId === followingId) {
      const err = new Error("Cannot follow yourself") as CustomError;
      err.status = 400;
      throw err;
    }

    const targetUser = await User.findByPk(followingId);
    if (!targetUser) {
      const err = new Error("User not found") as CustomError;
      err.status = 404;
      throw err;
    }

    const existingFollow = await UserFollow.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    if (existingFollow) {
      const err = new Error("Already following this user") as CustomError;
      err.status = 400;
      throw err;
    }

    await UserFollow.create({
      follower_id: followerId,
      following_id: followingId
    });

    return { message: "User followed successfully", isFollowing: true };
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (
  followerId: string, 
  followingId: string
): Promise<{ message: string, isFollowing: boolean }> => {
  try {
    const followRelation = await UserFollow.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    if (!followRelation) {
      const err = new Error("Not following this user") as CustomError;
      err.status = 400;
      throw err;
    }

    await followRelation.destroy();

    return { message: "User unfollowed successfully", isFollowing: false };
  } catch (error) {
    throw error;
  }
};

export const getFollowers = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ followers: any[], total: number, hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await UserFollow.findAndCountAll({
      where: { following_id: userId },
      include: [{
        model: User,
        as: 'follower',
        attributes: ['id', 'name', 'email'],
        include: [{
          model: Profile,
          as: 'profile',
          attributes: ['first_name', 'last_name', 'profile_url', 'bio']
        }]
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      followers: rows.map(row => row.toJSON()),
      total: count,
      hasMore: offset + limit < count
    };
  } catch (error) {
    throw error;
  }
};

export const getFollowing = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ following: any[], total: number, hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await UserFollow.findAndCountAll({
      where: { follower_id: userId },
      include: [{
        model: User,
        as: 'followingUser',
        attributes: ['id', 'name', 'email'],
        include: [{
          model: Profile,
          as: 'profile',
          attributes: ['first_name', 'last_name', 'profile_url', 'bio']
        }]
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      following: rows.map(row => row.toJSON()),
      total: count,
      hasMore: offset + limit < count
    };
  } catch (error) {
    throw error;
  }
};

export const isFollowing = async (
  followerId: string, 
  followingId: string
): Promise<boolean> => {
  try {
    const followRelation = await UserFollow.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    return !!followRelation;
  } catch (error) {
    throw error;
  }
};

export const getFollowStats = async (
  userId: string
): Promise<{ followersCount: number, followingCount: number }> => {
  try {
    const [followersCount, followingCount] = await Promise.all([
      UserFollow.count({ where: { following_id: userId } }),
      UserFollow.count({ where: { follower_id: userId } })
    ]);

    return { followersCount, followingCount };
  } catch (error) {
    throw error;
  }
};

export const getUsersToFollow = async (
  currentUserId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ users: any[], total: number, hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const followingIds = await UserFollow.findAll({
      where: { follower_id: currentUserId },
      attributes: ['following_id']
    });

    const excludeIds = [currentUserId, ...followingIds.map(f => f.following_id)];

    const { count, rows } = await User.findAndCountAll({
      where: {
        id: { [Op.notIn]: excludeIds }
      },
      include: [{
        model: Profile,
        as: 'profile',
        attributes: ['first_name', 'last_name', 'profile_url', 'bio']
      }],
      attributes: ['id', 'name', 'email'],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      users: rows.map(row => row.toJSON()),
      total: count,
      hasMore: offset + limit < count
    };
  } catch (error) {
    throw error;
  }
};