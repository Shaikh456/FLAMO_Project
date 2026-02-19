import axiosInstance from "./axiosInstance";

// Create
export const createHeirloom = async (formData) => {
  const response = await axiosInstance.post(
    "/heirlooms/create",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
  return response.data;
};

// Get
export const getHeirlooms = async () => {
  const response = await axiosInstance.get("/heirlooms");
  return response.data;
};

// Delete
export const deleteHeirloom = async (id) => {
  const response = await axiosInstance.delete(`/heirlooms/${id}`);
  return response.data;
};

// 🔥 Update
export const updateHeirloom = async (id, data) => {
  const response = await axiosInstance.put(
    `/heirlooms/${id}`,
    data
  );
  return response.data;
};

/* TRANSFER (Manual) */
export const transferHeirloom = async (id, nextOwnerId) => {
  const res = await axiosInstance.post(
    `/heirlooms/${id}/transfer`,
    { nextOwnerId }
  );
  return res.data;
};

/* SCHEDULE TRANSFER */
export const scheduleHeirloomTransfer = async (
  id,
  nextOwnerId,
  transferDate
) => {
  const res = await axiosInstance.post(
    `/heirlooms/${id}/schedule-transfer`,
    { nextOwnerId, transferDate }
  );
  return res.data;
};
