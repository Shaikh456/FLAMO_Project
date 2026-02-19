import axiosInstance from "./axiosInstance";

export const createFamily = async (data) => {
  const response = await axiosInstance.post("/family/create", data);
  return response.data;
};

export const joinFamily = async (data) => {
  const response = await axiosInstance.post("/family/join", data);
  return response.data;
};

export const getFamilyMembers = async () => {
  const response = await axiosInstance.get("/family/members");
  return response.data;
};
