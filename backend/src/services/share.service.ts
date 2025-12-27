import { Post, PostShare, User, Profile } from '@models/index.js';
import type { CustomError, PostShareModel, PostModel } from '@/types/index';

export const sharePost = async (postId: string, userId: string, sharedContent?: string): Promise<PostShareModel> => {
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      const err = new Error('Post not found') as CustomError;
      err.status = 404;
      throw err;
    }

    const existingShare = await PostShare.findOne({
      where: { post_id: postId, user_id: userId },
    });

    if (existingShare) {
      const err = new Error('You have already shared this post') as CustomError;
      err.status = 409;
      throw err;
    }

    const share = await PostShare.create({
      post_id: postId,
      user_id: userId,
      shared_content: sharedContent?.trim() || undefined,
    });

    await Post.increment('shares_count', { where: { id: postId } });

    return await getShare(share.id);
  } catch (error) {
    throw error;
  }
};

export const unsharePost = async (postId: string, userId: string): Promise<{ message: string }> => {
  try {
    const share = await PostShare.findOne({
      where: { post_id: postId, user_id: userId },
    });

    if (!share) {
      const err = new Error('Share not found') as CustomError;
      err.status = 404;
      throw err;
    }

    await PostShare.destroy({
      where: { post_id: postId, user_id: userId },
    });

    await Post.decrement('shares_count', { where: { id: postId } });

    return { message: 'Post unshared successfully' };
  } catch (error) {
    throw error;
  }
};

export const getShare = async (shareId: string): Promise<PostShareModel> => {
  try {
    const share = await PostShare.findOne({
      where: { id: shareId },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: Profile,
              as: 'profile',
            },
          ],
        },
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'user',
              include: [
                {
                  model: Profile,
                  as: 'profile',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!share) {
      const err = new Error('Share not found') as CustomError;
      err.status = 404;
      throw err;
    }

    return share.toJSON() as PostShareModel;
  } catch (error) {
    throw error;
  }
};

export const getPostShares = async (
  postId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ shares: PostShareModel[]; total: number; hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await PostShare.findAndCountAll({
      where: { post_id: postId },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: Profile,
              as: 'profile',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      shares: rows.map((row) => row.toJSON() as PostShareModel),
      total: count,
      hasMore: offset + limit < count,
    };
  } catch (error) {
    throw error;
  }
};

export const getUserShares = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ shares: PostShareModel[]; total: number; hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await PostShare.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'user',
              include: [
                {
                  model: Profile,
                  as: 'profile',
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          include: [
            {
              model: Profile,
              as: 'profile',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      shares: rows.map((row) => row.toJSON() as PostShareModel),
      total: count,
      hasMore: offset + limit < count,
    };
  } catch (error) {
    throw error;
  }
};

export const isPostSharedByUser = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const share = await PostShare.findOne({
      where: { post_id: postId, user_id: userId },
    });
    return !!share;
  } catch (error) {
    return false;
  }
};

export const getUserTimeline = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
  currentUserId?: string,
): Promise<{ posts: any[]; total: number; hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const originalPosts = await Post.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: Profile,
              as: 'profile',
            },
          ],
        },
      ],
    });

    const sharedPosts = await PostShare.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'user',
              include: [
                {
                  model: Profile,
                  as: 'profile',
                },
              ],
            },
          ],
        },
      ],
    });

    const timeline = [
      ...originalPosts.map((post) => ({
        ...post.toJSON(),
        type: 'original',
        timeline_date: post.createdAt,
      })),
      ...sharedPosts.map((share) => {
        const shareData = share.toJSON() as PostShareModel;
        return {
          ...shareData.post,
          type: 'shared',
          timeline_date: share.createdAt,
          shared_by: share.user_id,
          shared_content: share.shared_content,
        };
      }),
    ].sort((a, b) => new Date(b.timeline_date).getTime() - new Date(a.timeline_date).getTime());

    const paginatedTimeline = timeline.slice(offset, offset + limit);

    return {
      posts: paginatedTimeline,
      total: timeline.length,
      hasMore: offset + limit < timeline.length,
    };
  } catch (error) {
    throw error;
  }
};
