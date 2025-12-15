import { Post, PostImage, PostLike, User, Profile } from "../models/index.js";
import type { CustomError, PostModel } from "../types/index.js";
import { StorageService } from "./storage.service.js";

export const createPost = async (
  userId: string, 
  content: string, 
  imageUrls: string[] = []
): Promise<PostModel> => {
  try {
    console.log('Creating post for user:', userId);
    console.log('Content:', content);
    console.log('Image URLs:', imageUrls);
    
    const post = await Post.create({
      user_id: userId,
      content: content || undefined,
    });

    console.log('Post created with ID:', post.id);
    console.log('Post data:', post.toJSON());

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
      console.log('All images created successfully');
    }

    console.log('Fetching complete post...');
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
  userId?: string
): Promise<{ posts: PostModel[], total: number, hasMore: boolean }> => {
  try {
    const offset = (page - 1) * limit;
    
    const whereClause = userId ? { user_id: userId } : {};

    const { count, rows } = await Post.findAndCountAll({
      where: whereClause,
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
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      posts: rows.map(row => row.toJSON() as PostModel),
      total: count,
      hasMore: offset + limit < count
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

    // Delete images from storage
    if (postData.images && postData.images.length > 0) {
      const imageUrls = postData.images.map(img => img.image_url);
      await StorageService.deletePostImages(imageUrls);
    }

    // Delete post (cascade will handle related records)
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