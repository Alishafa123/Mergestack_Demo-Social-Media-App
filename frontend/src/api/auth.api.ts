import api from '@services/axios';
import type {
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '@schemas/authSchemas';

export const loginUser = async (data: LoginFormData) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const signupUser = async (data: SignupFormData) => {
  const res = await api.post('/auth/signup', data);
  return res.data;
};

export const forgotPassword = async (data: ForgotPasswordFormData) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

export const resetPassword = async (data: ResetPasswordFormData & { token: string }) => {
  // Parse token data (contains both access and refresh tokens)
  const tokenData = JSON.parse(data.token);
  const res = await api.post(
    '/auth/reset-password',
    {
      password: data.password,
      refresh_token: tokenData.refresh_token,
    },
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
  );
  return res.data;
};
