export const AUTH_ERRORS = {
  LOGIN_FAILED: 'Login failed. Please check your credentials and try again.',
  SIGNUP_FAILED: 'Signup failed. Please try again.',
  LOGOUT_FAILED: 'Failed to logout. Please try again.',
  PASSWORD_RESET_FAILED: 'Failed to send password reset email. Please try again.',
  PASSWORD_RESET_INVALID: 'Failed to reset password. Please try again.',
} as const;

export const POST_ERRORS = {
  CREATE_FAILED: 'Failed to create post. Please try again.',
  UPDATE_FAILED: 'Failed to update post. Please try again.',
  DELETE_FAILED: 'Failed to delete post. Please try again.',
  SHARE_FAILED: 'Failed to share post. Please try again.',
  FETCH_FAILED: 'Failed to load posts. Please try again.',
} as const;

export const PROFILE_ERRORS = {
  UPDATE_FAILED: 'Failed to update profile. Please try again.',
  DELETE_FAILED: 'Failed to delete profile. Please try again.',
  FETCH_FAILED: 'Failed to load profile. Please try again.',
} as const;

export const USER_ERRORS = {
  FOLLOW_FAILED: 'Failed to follow user. Please try again.',
  UNFOLLOW_FAILED: 'Failed to unfollow user. Please try again.',
  FETCH_FAILED: 'Failed to load user data. Please try again.',
  SEARCH_FAILED: 'Failed to search users. Please try again.',
} as const;

export const COMMENT_ERRORS = {
  CREATE_FAILED: 'Failed to create comment. Please try again.',
  UPDATE_FAILED: 'Failed to update comment. Please try again.',
  DELETE_FAILED: 'Failed to delete comment. Please try again.',
  FETCH_FAILED: 'Failed to load comments. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  SIGNUP_SUCCESS: 'Account created successfully! Please check your email to verify your account.',
  LOGOUT_SUCCESS: 'You have been logged out successfully',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent successfully! Please check your inbox.',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully! You can now login with your new password.',
  
  POST_CREATED: 'Post created successfully! 🎉',
  POST_UPDATED: 'Post updated successfully! ✏️',
  POST_DELETED: 'Post deleted successfully! 🗑️',
  POST_SHARED: 'Post shared successfully! 📢',
  POST_UNSHARED: 'Post unshared successfully! 📤',
  
  PROFILE_UPDATED: 'Profile updated successfully! ✨',
  PROFILE_DELETED: 'Profile deleted successfully!',
  
  USER_FOLLOWED: 'User followed successfully! 👥',
  USER_UNFOLLOWED: 'User unfollowed successfully!',
  
  COMMENT_CREATED: 'Comment added successfully! 💬',
  COMMENT_UPDATED: 'Comment updated successfully!',
  COMMENT_DELETED: 'Comment deleted successfully!',
} as const;

export const GENERIC_ERRORS = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

export const LOADING_MESSAGES = {
  SIGNING_IN: 'Signing in...',
  CREATING_ACCOUNT: 'Creating account...',
  UPDATING_PROFILE: 'Updating profile...',
  CREATING_POST: 'Creating post...',
  UPDATING_POST: 'Updating post...',
  DELETING_POST: 'Deleting post...',
  LOADING: 'Loading...',
} as const;