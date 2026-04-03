// reportsService.js - Direct API calls to FastAPI Reports Microservice
import axios from 'axios';

const REPORTS_BASE_URL = '/api/reports';

const reportsApi = axios.create({
    baseURL: REPORTS_BASE_URL,
});

export const getEmployeesJSON = () =>
    reportsApi.get('/employees/export?format=json');

export const getDepartmentSummary = () =>
    reportsApi.get('/departments/summary');

export const getAttendanceSummary = (start_date = null, end_date = null) => {
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    return reportsApi.get(`/attendance/summary?${params}`);
};

export const downloadEmployeesCSV = () =>
    reportsApi.get('/employees/export?format=csv', { responseType: 'blob' });

export const downloadEmployeesExcel = () =>
    reportsApi.get('/employees/export-excel', { responseType: 'blob' });

export const downloadAttendanceCSV = (start_date = null, end_date = null) => {
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    return reportsApi.get(`/attendance/export?${params}`, { responseType: 'blob' });
};
