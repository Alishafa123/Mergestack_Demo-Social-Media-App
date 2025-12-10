import api from "../services/axios";
import type { LoginFormData, SignupFormData } from "../schemas/authSchemas";

export const loginUser = async (data: LoginFormData) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const signupUser = async (data: SignupFormData) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};
