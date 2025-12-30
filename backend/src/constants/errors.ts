export const AUTH_ERRORS = {
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
  INVALID_CREDENTIALS: 'Invalid credentials',
  AUTHENTICATION_FAILED: 'Authentication failed',
  EMAIL_PASSWORD_NAME_REQUIRED: 'Email, password, and name are required',
  USER_ALREADY_EXISTS: 'User already exists with this email',
  REGISTRATION_FAILED: 'Registration failed',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_RESET_FAILED: 'Failed to send password reset email',
  ACCESS_TOKEN_PASSWORD_REQUIRED: 'Access token and new password are required',
  INVALID_RESET_TOKEN: 'Invalid or expired reset token',
  PASSWORD_UPDATE_FAILED: 'Failed to update password',
  AUTHORIZATION_TOKEN_REQUIRED: 'Authorization token is required',
} as const;

export const POST_ERRORS = {
  CONTENT_OR_IMAGES_REQUIRED: 'Post must have either content or images',
  IMAGE_UPLOAD_FAILED: 'Failed to upload post images',
  POST_ID_REQUIRED: 'Post ID is required',
  CONTENT_REQUIRED: 'Content is required',
  POST_NOT_FOUND: 'Post not found',
  POST_NOT_FOUND_OR_UNAUTHORIZED: 'Post not found or unauthorized',
} as const;

export const USER_ERRORS = {
  CANNOT_FOLLOW_YOURSELF: 'Cannot follow yourself',
  USER_NOT_FOUND: 'User not found',
  ALREADY_FOLLOWING: 'Already following this user',
  NOT_FOLLOWING: 'Not following this user',
  USER_ID_REQUIRED: 'User ID is required',
} as const;

export const PROFILE_ERRORS = {
  USER_NOT_FOUND: 'User not found',
  PROFILE_IMAGE_UPLOAD_FAILED: 'Failed to upload profile image',
  SEARCH_QUERY_REQUIRED: 'Search query is required',
  SEARCH_QUERY_TOO_SHORT: 'Search query must be at least 2 characters',
} as const;

export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_LIKED: 'Post liked',
  POST_UNLIKED: 'Post unliked',
  USER_FOLLOWED: 'User followed successfully',
  USER_UNFOLLOWED: 'User unfollowed successfully',
  PROFILE_DELETED: 'Profile deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_UPDATED: 'Password updated successfully. You can now login with your new password',
  EMAIL_CONFIRMATION_REQUIRED: 'Please check your email to confirm your account before logging in',
  PASSWORD_RESET_EMAIL_SENT: 'If an account exists with this email, you will receive a password reset link shortly',
  USER_CREATED: 'User created successfully',
  USER_ALREADY_EXISTS_MESSAGE: 'User already exists',
} as const;

export const GENERIC_ERRORS = {
  UNKNOWN_UPLOAD_ERROR: 'Unknown upload error',
  EVENT_NOT_HANDLED: 'Event not handled',
} as const;