import { Post, PostImage, PostLike, PostShare, User, Profile, UserFollow } from "../models/index.js";
import type { CustomError, PostModel } from "../types/index.js";
import { StorageService } from "./storage.service.js";
import { Op } from "sequelize";

export const createPost = async (
  userId: string, 
  content: string, 
  imageUrls: string[] = []
): Promise<PostModel> => {
  try {
    
    const post = await Post.create({
      user_id: userId,
      content: content || undefined,
    });

    if (imageUrls.length > 0) {
      console.log(`Creating ${imageUrls.length} post images...`);
      const imagePromises = imageUrls.map((url, index) => {
        console.log(`Creating image ${index + 1}: post_id=${post.id}, url=${url}`);
        return PostImage.create({
          post_id: post.id,
          image_url: url,
          image_order: index + 1,
        });
      });
      await Promise.all(imagePromises);
    }

    return await getPost(post.id);
  } catch (error) {
    console.error('Error in createPost:', error);
    throw error;
  }
};



export const getPost = async (postId: string): Promise<PostModel> => {
  try {
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          as: 'user',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        },
        {
          model: PostImage,
          as: 'images',
          order: [['image_order', 'ASC']]
        }
      ]
    });

    if (!post) {
      const err = new Error("Post not found") as CustomError;
      err.status = 404;
      throw err;
    }

    return post.toJSON() as PostModel;
  } catch (error) {
    throw error;
  }
};

export const getPosts = async (
  page: number = 1, 
  limit: number = 10,
  userId?: string,
  currentUserId?: string
): Promise<{ posts: PostModel[], total: number, hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;
    
    if (userId) {
      const originalPosts = await Post.findAll({
        where: { user_id: userId },
        include: [
          {
            model: User,
            as: 'user',
            include: [{
              model: Profile,
              as: 'profile'
            }]
          },
          {
            model: PostImage,
            as: 'images',
            order: [['image_order', 'ASC']]
          },
          ...(currentUserId ? [{
            model: PostLike,
            as: 'userLike',
            where: { user_id: currentUserId },
            required: false,
            attributes: ['id'] 
          }] : []),
          ...(currentUserId ? [{
            model: PostShare,
            as: 'userShare',
            where: { user_id: currentUserId },
            required: false,
            attributes: ['id']
          }] : [])
        ],
        order: [['createdAt', 'DESC']],
      });

      // Get posts shared by the user
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
                include: [{
                  model: Profile,
                  as: 'profile'
                }]
              },
              {
                model: PostImage,
                as: 'images',
                order: [['image_order', 'ASC']]
              },
              ...(currentUserId ? [{
                model: PostLike,
                as: 'userLike',
                where: { user_id: currentUserId },
                required: false,
                attributes: ['id']
              }] : []),
              ...(currentUserId ? [{
                model: PostShare,
                as: 'userShare',
                where: { user_id: currentUserId },
                required: false,
                attributes: ['id']
              }] : [])
            ]
          },
          {
            model: User,
            as: 'user',
            include: [{
              model: Profile,
              as: 'profile'
            }]
          }
        ],
        order: [['createdAt', 'DESC']],
      });

      // Combine and sort by timeline date
      const timeline = [
        ...originalPosts.map(post => {
          const postData = post.toJSON() as any;
          return {
            ...postData,
            type: 'original',
            timeline_date: post.createdAt,
            isLiked: currentUserId ? !!(postData.userLike) : false,
            isShared: currentUserId ? !!(postData.userShare) : false,
            userLike: undefined,
            userShare: undefined
          };
        }),
        ...sharedPosts.map(share => {
          const shareData = share.toJSON() as any;
          const postData = shareData.post;
          return {
            ...postData,
            type: 'shared',
            timeline_date: share.createdAt,
            shared_by: shareData.user,
            shared_content: shareData.shared_content,
            shared_at: share.createdAt,
            isLiked: currentUserId ? !!(postData.userLike) : false,
            isShared: currentUserId ? !!(postData.userShare) : false,
            userLike: undefined,
            userShare: undefined
          };
        })
      ].sort((a, b) => new Date(b.timeline_date).getTime() - new Date(a.timeline_date).getTime());

      // Apply pagination
      const paginatedPosts = timeline.slice(offset, offset + limit);

      return {
        posts: paginatedPosts.map(post => {
          delete post.userLike;
          delete post.userShare;
          return post as PostModel;
        }),
        total: timeline.length,
        hasMore: offset + limit < timeline.length
      };
    }

    const originalPosts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'user',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        },
        {
          model: PostImage,
          as: 'images',
          order: [['image_order', 'ASC']]
        },
        ...(currentUserId ? [{
          model: PostLike,
          as: 'userLike',
          where: { user_id: currentUserId },
          required: false,
          attributes: ['id'] 
        }] : []),
        ...(currentUserId ? [{
          model: PostShare,
          as: 'userShare',
          where: { user_id: currentUserId },
          required: false,
          attributes: ['id']
        }] : [])
      ],
      order: [['createdAt', 'DESC']],
    });

    const sharedPosts = await PostShare.findAll({
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'user',
              include: [{
                model: Profile,
                as: 'profile'
              }]
            },
            {
              model: PostImage,
              as: 'images',
              order: [['image_order', 'ASC']]
            },
            ...(currentUserId ? [{
              model: PostLike,
              as: 'userLike',
              where: { user_id: currentUserId },
              required: false,
              attributes: ['id']
            }] : []),
            ...(currentUserId ? [{
              model: PostShare,
              as: 'userShare',
              where: { user_id: currentUserId },
              required: false,
              attributes: ['id']
            }] : [])
          ]
        },
        {
          model: User,
          as: 'user',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    const timeline = [
      ...originalPosts.map(post => {
        const postData = post.toJSON() as any;
        return {
          ...postData,
          type: 'original',
          timeline_date: post.createdAt,
          isLiked: currentUserId ? !!(postData.userLike) : false,
          isShared: currentUserId ? !!(postData.userShare) : false,
          userLike: undefined,
          userShare: undefined
        };
      }),
      ...sharedPosts.map(share => {
        const shareData = share.toJSON() as any;
        const postData = shareData.post;
        return {
          ...postData,
          type: 'shared',
          timeline_date: share.createdAt,
          shared_by: shareData.user,
          shared_content: shareData.shared_content,
          shared_at: share.createdAt,
          isLiked: currentUserId ? !!(postData.userLike) : false,
          isShared: currentUserId ? !!(postData.userShare) : false,
          userLike: undefined,
          userShare: undefined
        };
      })
    ].sort((a, b) => new Date(b.timeline_date).getTime() - new Date(a.timeline_date).getTime());

    const paginatedPosts = timeline.slice(offset, offset + limit);

    return {
      posts: paginatedPosts.map(post => {
        delete post.userLike;
        delete post.userShare;
        return post as PostModel;
      }),
      total: timeline.length,
      hasMore: offset + limit < timeline.length
    };
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (
  postId: string, 
  userId: string, 
  content: string
): Promise<PostModel> => {
  try {
    const post = await Post.findOne({
      where: { id: postId, user_id: userId }
    });

    if (!post) {
      const err = new Error("Post not found or unauthorized") as CustomError;
      err.status = 404;
      throw err;
    }

    await Post.update(
      { content },
      { where: { id: postId, user_id: userId } }
    );

    return await getPost(postId);
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId: string, userId: string): Promise<{ message: string }> => {
  try {
    const post = await Post.findOne({
      where: { id: postId, user_id: userId },
      include: [{
        model: PostImage,
        as: 'images'
      }]
    });

    if (!post) {
      const err = new Error("Post not found or unauthorized") as CustomError;
      err.status = 404;
      throw err;
    }

    const postData = post.toJSON() as PostModel;

    if (postData.images && postData.images.length > 0) {
      const imageUrls = postData.images.map(img => img.image_url);
      await StorageService.deletePostImages(imageUrls);
    }

    await Post.destroy({
      where: { id: postId, user_id: userId }
    });

    return { message: "Post deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export const toggleLike = async (
  postId: string, 
  userId: string
): Promise<{ liked: boolean, likesCount: number }> => {
  try {
    const post = await Post.findByPk(postId);
    
    if (!post) {
      const err = new Error("Post not found") as CustomError;
      err.status = 404;
      throw err;
    }

    const existingLike = await PostLike.findOne({
      where: { post_id: postId, user_id: userId }
    });

    let liked: boolean;
    let newLikesCount: number;

    if (existingLike) {
      // Unlike the post
      await PostLike.destroy({
        where: { post_id: postId, user_id: userId }
      });
      newLikesCount = Math.max(0, post.likes_count - 1);
      liked = false;
    } else {
      // Like the post
      await PostLike.create({
        post_id: postId,
        user_id: userId
      });
      newLikesCount = post.likes_count + 1;
      liked = true;
    }

    // Update likes count
    await Post.update(
      { likes_count: newLikesCount },
      { where: { id: postId } }
    );

    return { liked, likesCount: newLikesCount };
  } catch (error) {
    throw error;
  }
};

export const getTrendingPosts = async (
  page: number = 1,
  limit: number = 10,
  currentUserId?: string
): Promise<{ posts: PostModel[], total: number, hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const originalPosts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'user',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        },
        {
          model: PostImage,
          as: 'images',
          order: [['image_order', 'ASC']]
        },
        ...(currentUserId ? [{
          model: PostLike,
          as: 'userLike',
          where: { user_id: currentUserId },
          required: false,
          attributes: ['id']
        }] : []),
        ...(currentUserId ? [{
          model: PostShare,
          as: 'userShare',
          where: { user_id: currentUserId },
          required: false,
          attributes: ['id']
        }] : [])
      ],
      order: [
        ['likes_count', 'DESC'],
        ['createdAt', 'DESC']
      ],
    });

    // Get shared posts
    const sharedPosts = await PostShare.findAll({
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'user',
              include: [{
                model: Profile,
                as: 'profile'
              }]
            },
            {
              model: PostImage,
              as: 'images',
              order: [['image_order', 'ASC']]
            },
            ...(currentUserId ? [{
              model: PostLike,
              as: 'userLike',
              where: { user_id: currentUserId },
              required: false,
              attributes: ['id']
            }] : []),
            ...(currentUserId ? [{
              model: PostShare,
              as: 'userShare',
              where: { user_id: currentUserId },
              required: false,
              attributes: ['id']
            }] : [])
          ]
        },
        {
          model: User,
          as: 'user',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    // Combine and sort by likes count (most liked posts first)
    const timeline = [
      ...originalPosts.map(post => {
        const postData = post.toJSON() as any;
        return {
          ...postData,
          type: 'original',
          timeline_date: post.createdAt,
          isLiked: currentUserId ? !!(postData.userLike) : false,
          isShared: currentUserId ? !!(postData.userShare) : false,
          userLike: undefined,
          userShare: undefined
        };
      }),
      ...sharedPosts.map(share => {
        const shareData = share.toJSON() as any;
        const postData = shareData.post;
        return {
          ...postData,
          type: 'shared',
          timeline_date: share.createdAt,
          shared_by: shareData.user,
          shared_content: shareData.shared_content,
          shared_at: share.createdAt,
          isLiked: currentUserId ? !!(postData.userLike) : false,
          isShared: currentUserId ? !!(postData.userShare) : false,
          userLike: undefined,
          userShare: undefined
        };
      })
    ].sort((a, b) => {
      if (b.likes_count !== a.likes_count) {
        return b.likes_count - a.likes_count;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const paginatedPosts = timeline.slice(offset, offset + limit);

    return {
      posts: paginatedPosts.map(post => {
        delete post.userLike;
        delete post.userShare;
        return post as PostModel;
      }),
      total: timeline.length,
      hasMore: offset + limit < timeline.length
    };
  } catch (error) {
    throw error;
  }
};

export const getUserTopPosts = async (
  userId: string
): Promise<{ posts: any[] }> => {
  try {
    const posts = await Post.findAll({
      where: { user_id: userId },
      attributes: ['id', 'content', 'likes_count', 'comments_count', 'shares_count', 'createdAt'],
      order: [
        ['likes_count', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: 3,
    });

    return {
      posts: posts.map(post => post.toJSON())
    };
  } catch (error) {
    throw error;
  }
};

export const getFollowersFeed = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ posts: PostModel[], total: number, hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;

    const followedUsers = await UserFollow.findAll({
      where: { follower_id: userId },
      attributes: ['following_id']
    });

    const followedUserIds = followedUsers.map(follow => follow.following_id);

    if (followedUserIds.length === 0) {
      return {
        posts: [],
        total: 0,
        hasMore: false
      };
    }

   
    const originalPosts = await Post.findAll({
      where: {
        user_id: {
          [Op.in]: followedUserIds
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        },
        {
          model: PostImage,
          as: 'images',
          order: [['image_order', 'ASC']]
        },
        {
          model: PostLike,
          as: 'userLike',
          where: { user_id: userId },
          required: false,
          attributes: ['id']
        },
        {
          model: PostShare,
          as: 'userShare',
          where: { user_id: userId },
          required: false,
          attributes: ['id']
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    // Get posts shared by followed users
    const sharedPosts = await PostShare.findAll({
      where: {
        user_id: {
          [Op.in]: followedUserIds
        }
      },
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'user',
              include: [{
                model: Profile,
                as: 'profile'
              }]
            },
            {
              model: PostImage,
              as: 'images',
              order: [['image_order', 'ASC']]
            },
            {
              model: PostLike,
              as: 'userLike',
              where: { user_id: userId },
              required: false,
              attributes: ['id']
            },
            {
              model: PostShare,
              as: 'userShare',
              where: { user_id: userId },
              required: false,
              attributes: ['id']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    // Combine and sort by timeline date
    const timeline = [
      ...originalPosts.map(post => {
        const postData = post.toJSON() as any;
        return {
          ...postData,
          type: 'original',
          timeline_date: post.createdAt,
          isLiked: !!(postData.userLike),
          isShared: !!(postData.userShare),
          userLike: undefined,
          userShare: undefined
        };
      }),
      ...sharedPosts.map(share => {
        const shareData = share.toJSON() as any;
        const postData = shareData.post;
        return {
          ...postData,
          type: 'shared',
          timeline_date: share.createdAt,
          shared_by: shareData.user,
          shared_content: shareData.shared_content,
          shared_at: share.createdAt,
          isLiked: !!(postData.userLike),
          isShared: !!(postData.userShare),
          userLike: undefined,
          userShare: undefined
        };
      })
    ].sort((a, b) => new Date(b.timeline_date).getTime() - new Date(a.timeline_date).getTime());

    // Apply pagination
    const paginatedPosts = timeline.slice(offset, offset + limit);

    return {
      posts: paginatedPosts.map(post => {
        delete post.userLike;
        delete post.userShare;
        return post as PostModel;
      }),
      total: timeline.length,
      hasMore: offset + limit < timeline.length
    };
  } catch (error) {
    throw error;
  }
};