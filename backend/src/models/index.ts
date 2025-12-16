import User from "./user.model.js";
import Profile from "./profile.model.js";
import Post from "./post.model.js";
import PostImage from "./post-image.model.js";
import PostLike from "./post-like.model.js";
import PostComment from "./post-comment.model.js";
import PostShare from "./post-share.model.js";

// User - Profile relationship
User.hasOne(Profile, {
  foreignKey: 'user_id',
  as: 'profile',
  onDelete: 'CASCADE'
});

Profile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

// User - Posts relationship
User.hasMany(Post, {
  foreignKey: 'user_id',
  as: 'posts',
  onDelete: 'CASCADE'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

// Post - PostImages relationship
Post.hasMany(PostImage, {
  foreignKey: 'post_id',
  as: 'images',
  onDelete: 'CASCADE'
});

PostImage.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post',
  onDelete: 'CASCADE'
});

// Post - PostLikes relationship
Post.hasMany(PostLike, {
  foreignKey: 'post_id',
  as: 'likes',
  onDelete: 'CASCADE'
});

// Post - Single User Like (for checking if current user liked)
Post.hasOne(PostLike, {
  foreignKey: 'post_id',
  as: 'userLike',
  onDelete: 'CASCADE'
});

PostLike.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post',
  onDelete: 'CASCADE'
});

// User - PostLikes relationship
User.hasMany(PostLike, {
  foreignKey: 'user_id',
  as: 'likedPosts',
  onDelete: 'CASCADE'
});

PostLike.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

// Post - PostComments relationship
Post.hasMany(PostComment, {
  foreignKey: 'post_id',
  as: 'comments',
  onDelete: 'CASCADE'
});

PostComment.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post',
  onDelete: 'CASCADE'
});

// User - PostComments relationship
User.hasMany(PostComment, {
  foreignKey: 'user_id',
  as: 'comments',
  onDelete: 'CASCADE'
});

PostComment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

// PostComment - Self-referencing relationship (for replies)
PostComment.hasMany(PostComment, {
  foreignKey: 'parent_comment_id',
  as: 'replies',
  onDelete: 'CASCADE'
});

PostComment.belongsTo(PostComment, {
  foreignKey: 'parent_comment_id',
  as: 'parentComment',
  onDelete: 'CASCADE'
});

// Post - PostShares relationship
Post.hasMany(PostShare, {
  foreignKey: 'post_id',
  as: 'shares',
  onDelete: 'CASCADE'
});

// Post - Single User Share (for checking if current user shared)
Post.hasOne(PostShare, {
  foreignKey: 'post_id',
  as: 'userShare',
  onDelete: 'CASCADE'
});

PostShare.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post',
  onDelete: 'CASCADE'
});

// User - PostShares relationship
User.hasMany(PostShare, {
  foreignKey: 'user_id',
  as: 'sharedPosts',
  onDelete: 'CASCADE'
});

PostShare.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

export { User, Profile, Post, PostImage, PostLike, PostComment, PostShare };