import axiosInstance from "./axiosInstance";

export const getAttendance = async () => {
  const response = await axiosInstance.get('/attendance');
  return response.data;
};

export const createAttendance = (data) => {
  return axiosInstance.post("/attendance", data);
};

export const updateAttendance = (id, data) => {
  return axiosInstance.put(`/attendance/${id}`, data);
};

export const deleteAttendance = (id) => {
  return axiosInstance.delete(`/attendance/${id}`);
};