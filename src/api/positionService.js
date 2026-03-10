import axiosInstance from "./axiosInstance";

export const getPositions = (page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) params.append('search', search);
  
  return axiosInstance.get(`/positions?${params.toString()}`);
};

export const createPosition = (data) => {
  return axiosInstance.post("/positions", data);
};

export const updatePosition = (id, data) => {
  return axiosInstance.put(`/positions/${id}`, data);
};

export const deletePosition = (id) => {
  return axiosInstance.delete(`/positions/${id}`);
};