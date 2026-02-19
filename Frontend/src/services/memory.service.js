import axiosInstance from "./axiosInstance";

/* Upload Memory */
export const createMemory = async (formData) => {
  const response = await axiosInstance.post(
    "/memories/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

/* Get Memories */
export const getMemories = async (params = {}) => {
  const response = await axiosInstance.get("/memories", { params });
  return response.data;
};

/* Update Memory (Add new images) */
export const updateMemory = async (id, formData) => {
  const response = await axiosInstance.put(
    `/memories/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const getFreshDownloadUrl = async (memoryId, index) => {
  const response = await axiosInstance.get(
    `/memories/${memoryId}/image/${index}/download`
  );
  return response.data;
};


export const downloadAllMemoryImages = async (memoryId) => {
  const response = await axiosInstance.get(
    `/memories/${memoryId}/download-all`,
    { responseType: "blob" }
  );

  return response;
};

/* Delete Memory */
export const deleteMemory = async (id) => {
  const response = await axiosInstance.delete(`/memories/${id}`);
  return response.data;
};

/* Delete Single Image */
export const deleteMemoryImage = async (memoryId, imageIndex) => {
  const response = await axiosInstance.delete(
    `/memories/${memoryId}/image/${imageIndex}`
  );
  return response.data;
};
