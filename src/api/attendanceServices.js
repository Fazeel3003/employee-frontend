import axiosInstance from "./axiosInstance";

export const getAttendance = (page = 1, limit = 10, empId = "", date = "") => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (empId) params.append('emp_id', empId);
  if (date) params.append('attendance_date', date);
  
  return axiosInstance.get(`/attendance?${params.toString()}`);
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