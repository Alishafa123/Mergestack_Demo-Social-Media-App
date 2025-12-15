
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