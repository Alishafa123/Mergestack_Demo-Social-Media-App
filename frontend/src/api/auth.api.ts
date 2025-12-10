import api from "../services/axios";

export const loginUser = async (data : any) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
