import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1"
});

export const getEmployees = async () => {
  const response = await API.get("/employees");
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await API.post("/employees", employeeData);
  return response.data;
};
