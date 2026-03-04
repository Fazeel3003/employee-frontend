import axiosInstance from "./axiosInstance";

export const getEmployees = () => {
  return axiosInstance.get("/employees");
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