
export interface CustomError extends Error {
  status?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SupabaseUser {
  id: string;
  email: string;
  name?: string;
}

export interface UserModel {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: ProfileModel;
  toJSON(): any;
  getDataValue(key: string): any;
}

export interface ProfileModel {
  id: number;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bio?: string;
  profile_url?: string;
  city?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
  toJSON(): any;
  getDataValue(key: string): any;
}

export interface PostModel {
  id: string;
  user_id: string;
  content?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
  isShared?: boolean;
  // Associated models (populated by includes)
  user?: UserModel;
  images?: PostImageModel[];
  likes?: PostLikeModel[];
  comments?: PostCommentModel[];
  shares?: PostShareModel[];
}

export interface PostImageModel {
  id: string;
  post_id: string;
  image_url: string;
  image_order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostLikeModel {
  id: string;
  post_id: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  // Associated models (populated by includes)
  user?: UserModel;
}

export interface PostCommentModel {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserModel;
  replies?: PostCommentModel[];
  parentComment?: PostCommentModel;
}

export interface PostShareModel {
  id: string;
  post_id: string;
  user_id: string;
  shared_content?: string;
  createdAt: Date;
  updatedAt: Date;
  // Associated models (populated by includes)
  user?: UserModel;
  post?: PostModel;
}

export interface UserFollowModel {
  id: string;
  follower_id: string;
  following_id: string;
  createdAt: Date;
  updatedAt: Date;
  // Associated models (populated by includes)
  follower?: UserModel;
  followingUser?: UserModel;
}


export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}