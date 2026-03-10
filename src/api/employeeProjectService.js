import axiosInstance from "./axiosInstance";

export const getEmployeeProjects = (page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) params.append('search', search);
  
  return axiosInstance.get(`/employee-projects?${params.toString()}`);
};

export const createEmployeeProject = (data) => {
  return axiosInstance.post("/employee-projects", data);
};

export const updateEmployeeProject = (id, data) => {
  return axiosInstance.put(`/employee-projects/${id}`, data);
};

export const deleteEmployeeProject = (id) => {
  return axiosInstance.delete(`/employee-projects/${id}`);
};