import { Op } from 'sequelize';

import type { CustomError, PostCommentModel } from '@/types/index';
import { Post, PostComment, User, Profile } from '@models/index';

export const createComment = async (
  postId: string,
  userId: string,
  content: string,
  parentCommentId?: string,
): Promise<PostCommentModel> => {
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      const err = new Error('Post not found') as CustomError;
      err.status = 404;
      throw err;
    }

    // If it's a reply, check if parent comment exists
    if (parentCommentId) {
      const parentComment = await PostComment.findByPk(parentCommentId);
      if (!parentComment) {
        const err = new Error('Parent comment not found') as CustomError;
        err.status = 404;
        throw err;
      }
    }

    // Create the comment
    const comment = await PostComment.create({
      post_id: postId,
      user_id: userId,
      content,
      parent_comment_id: parentCommentId || null,
    });

    await Post.increment('comments_count', { where: { id: postId } });

    return await getComment(comment.id);
  } catch (error) {
    throw error;
  }
};

export const getComment = async (commentId: string): Promise<PostCommentModel> => {
  try {
    const comment = await PostComment.findOne({
      where: { id: commentId },
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

    if (!comment) {
      const err = new Error('Comment not found') as CustomError;
      err.status = 404;
      throw err;
    }

    return comment.toJSON() as PostCommentModel;
  } catch (error) {
    throw error;
  }
};

export const getPostComments = async (
  postId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ comments: PostCommentModel[]; total: number; hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await PostComment.findAndCountAll({
      where: {
        post_id: postId,
        parent_comment_id: null,
      },
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
          model: PostComment,
          as: 'replies',
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
          order: [['createdAt', 'ASC']],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      comments: rows.map((row) => row.toJSON() as PostCommentModel),
      total: count,
      hasMore: offset + limit < count,
    };
  } catch (error) {
    throw error;
  }
};

export const updateComment = async (commentId: string, userId: string, content: string): Promise<PostCommentModel> => {
  try {
    const comment = await PostComment.findOne({
      where: { id: commentId, user_id: userId },
    });

    if (!comment) {
      const err = new Error('Comment not found or unauthorized') as CustomError;
      err.status = 404;
      throw err;
    }

    await PostComment.update({ content }, { where: { id: commentId, user_id: userId } });

    return await getComment(commentId);
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (commentId: string, userId: string): Promise<{ message: string }> => {
  try {
    const comment = await PostComment.findOne({
      where: { id: commentId, user_id: userId },
    });

    if (!comment) {
      const err = new Error('Comment not found or unauthorized') as CustomError;
      err.status = 404;
      throw err;
    }

    const postId = comment.post_id;

    // Count how many comments will be deleted (including replies)
    const commentsToDelete = await PostComment.count({
      where: {
        [Op.or]: [{ id: commentId }, { parent_comment_id: commentId }],
      },
    });

    // Delete the comment (cascade will handle replies)
    await PostComment.destroy({
      where: { id: commentId, user_id: userId },
    });

    // Update comments count on the post
    await Post.decrement('comments_count', {
      by: commentsToDelete,
      where: { id: postId },
    });

    return { message: 'Comment deleted successfully' };
  } catch (error) {
    throw error;
  }
};
