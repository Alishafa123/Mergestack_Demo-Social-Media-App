import { Op } from "sequelize";
import  sequelize  from "../config/database.js";
import { User, Profile } from "../models/index.js";
import type { CustomError, UserModel } from "../types/index.js";
import { StorageService } from "./storage.service.js";

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

export const searchUsersByName = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  currentUserId?: string
): Promise<{ users: UserModel[], total: number, hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      include: [{
        model: Profile,
        as: 'profile',
        where: {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${query}%` } },
            { last_name: { [Op.iLike]: `%${query}%` } }
          ]
        },
        required: true // INNER JOIN - only users with profiles
      }],
      where: {
        // Exclude current user from results
        ...(currentUserId && { id: { [Op.ne]: currentUserId } })
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit,
      offset,
      distinct: true
    });

    return {
      users: rows.map(user => user.toJSON() as UserModel),
      total: count,
      hasMore: offset + limit < count
    };
  } catch (error) {
    throw error;
  }
};