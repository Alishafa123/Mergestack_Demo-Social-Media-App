import { Op } from "sequelize";

import type { CustomError, PostModel } from "@/types/index";
import { StorageService } from "@services/storage.service.js";
import { Post, PostImage, PostLike, PostShare, User, Profile, UserFollow } from "@models/index.js";

// Helper function to build common post includes
const buildPostIncludes = (currentUserId?: string) => {
  const baseIncludes: any[] = [
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
      as: 'images'
    }
  ];

  if (currentUserId) {
    baseIncludes.push(
      {
        model: PostLike,
        as: 'userLike',
        where: { user_id: currentUserId },
        required: false,
        attributes: ['id']
      },
      {
        model: PostShare,
        as: 'userShare',
        where: { user_id: currentUserId },
        required: false,
        attributes: ['id']
      }
    );
  }

  return baseIncludes;
};

// Helper function to build shared post includes
const buildSharedPostIncludes = (currentUserId?: string) => {
  return [
    {
      model: Post,
      as: 'post',
      include: buildPostIncludes(currentUserId)
    },
    {
      model: User,
      as: 'user',
      include: [{
        model: Profile,
        as: 'profile'
      }]
    }
  ];
};

// Helper function to process timeline data
const buildTimelineData = (originalPosts: any[], sharedPosts: any[], currentUserId?: string) => {
  return [
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
  ];
};

// Helper function to apply pagination and cleanup
const applyPaginationAndCleanup = (
  timeline: any[], 
  page: number, 
  limit: number
): { posts: PostModel[], total: number, hasMore: boolean } => {
  const offset = (page - 1) * limit;
  const sortedTimeline = timeline.sort((a, b) => 
    new Date(b.timeline_date).getTime() - new Date(a.timeline_date).getTime()
  );
  
  const paginatedPosts = sortedTimeline.slice(offset, offset + limit);

  return {
    posts: paginatedPosts.map(post => {
      delete post.userLike;
      delete post.userShare;
      return post as PostModel;
    }),
    total: sortedTimeline.length,
    hasMore: offset + limit < sortedTimeline.length
  };
};

// Helper function to fetch original and shared posts
const fetchPostsData = async (
  whereClause: any = {},
  currentUserId?: string,
  orderBy: any[] = [['createdAt', 'DESC']]
) => {
  const originalPosts = await Post.findAll({
    where: whereClause,
    include: buildPostIncludes(currentUserId),
    order: [
      ...orderBy,
      [{ model: PostImage, as: 'images' }, 'image_order', 'ASC']
    ],
  });

  const sharedPostsWhere = Object.keys(whereClause).length > 0 ? whereClause : {};
  const sharedPosts = await PostShare.findAll({
    where: sharedPostsWhere,
    include: buildSharedPostIncludes(currentUserId),
    order: [
      ['createdAt', 'DESC'],
      [{ model: Post, as: 'post' }, { model: PostImage, as: 'images' }, 'image_order', 'ASC']
    ],
  });

  return { originalPosts, sharedPosts };
};

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
    const whereClause = userId ? { user_id: userId } : {};
    
    const { originalPosts, sharedPosts } = await fetchPostsData(
      whereClause,
      currentUserId
    );

    const timeline = buildTimelineData(originalPosts, sharedPosts, currentUserId);

    return applyPaginationAndCleanup(timeline, page, limit);
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
    const { originalPosts, sharedPosts } = await fetchPostsData(
      {}, 
      currentUserId,
      [['likes_count', 'DESC'], ['createdAt', 'DESC']]
    );

    const timeline = buildTimelineData(originalPosts, sharedPosts, currentUserId);

    const trendingTimeline = timeline.sort((a, b) => {
      if (b.likes_count !== a.likes_count) {
        return b.likes_count - a.likes_count;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Apply pagination manually since we need custom sorting
    const offset = (page - 1) * limit;
    const paginatedPosts = trendingTimeline.slice(offset, offset + limit);

    return {
      posts: paginatedPosts.map(post => {
        delete post.userLike;
        delete post.userShare;
        return post as PostModel;
      }),
      total: trendingTimeline.length,
      hasMore: offset + limit < trendingTimeline.length
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
    // Get followed users
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

    // Fetch posts from followed users using helper function
    const { originalPosts, sharedPosts } = await fetchPostsData(
      { user_id: { [Op.in]: followedUserIds } },
      userId // Always pass userId as currentUserId for followers feed
    );

    // Build timeline data using helper function
    const timeline = buildTimelineData(originalPosts, sharedPosts, userId);

    // Apply pagination and cleanup using helper function
    return applyPaginationAndCleanup(timeline, page, limit);
  } catch (error) {
    throw error;
  }
};