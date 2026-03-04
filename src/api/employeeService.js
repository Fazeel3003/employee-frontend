import axiosInstance from "./axiosInstance";

export const getEmployees = (page = 1, limit = 10) => {
  return axiosInstance.get(`/employees?page=${page}&limit=${limit}`);
};

export const getEmployeeById = (id) => {
  return axiosInstance.get(`/employees/${id}`);
};

export const createEmployee = (data) => {
  return axiosInstance.post("/employees", data);
};

export const updateEmployee = (id, data) => {
  return axiosInstance.put(`/employees/${id}`, data);
};

export const deleteEmployee = (id) => {
  return axiosInstance.delete(`/employees/${id}`);
};