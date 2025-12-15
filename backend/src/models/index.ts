import User from "./user.model.js";
import Profile from "./profile.model.js";
import Post from "./post.model.js";
import PostImage from "./post-image.model.js";
import PostLike from "./post-like.model.js";

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

export { User, Profile, Post, PostImage, PostLike };