import axiosInstance from './axiosInstance';

/**
 * Get Manager's Team Members
 * @returns {Promise} Team members data
 */
export const getTeamMembers = async () => {
  try {
    const response = await axiosInstance.get('/manager/team');
    console.log('Team Members API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

/**
 * Get Team Attendance
 * @param {Object} params - Query parameters (start_date, end_date)
 * @returns {Promise} Team attendance data
 */
export const getTeamAttendance = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/manager/team-attendance', { params });
    console.log('Team Attendance API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching team attendance:', error);
    throw error;
  }
};

/**
 * Get Team Leave Requests
 * @param {Object} params - Query parameters (status)
 * @returns {Promise} Team leave requests data
 */
export const getTeamLeaveRequests = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/manager/team-leaves', { params });
    console.log('Team Leave Requests API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching team leave requests:', error);
    throw error;
  }
};

/**
 * Get Team Projects
 * @returns {Promise} Team projects data
 */
export const getTeamProjects = async () => {
  try {
    const response = await axiosInstance.get('/manager/team-projects');
    console.log('Team Projects API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching team projects:', error);
    throw error;
  }
};

// Centralized project filtering utilities
export const projectFilters = {
  isActive: (project) => {
    if (!project || !project.status) return false;
    const status = project.status.toString().toLowerCase();
    return status === 'in progress' || status === 'active' || status === 'ongoing';
  },
  
  isCompleted: (project) => {
    if (!project || !project.status) return false;
    const status = project.status.toString().toLowerCase();
    return status === 'completed' || status === 'finished' || status === 'done';
  }
};

/**
 * Get Manager Dashboard Data (combined)
 * @returns {Promise} Combined dashboard data
 */
export const getDashboardData = async () => {
  try {
    // Use SAME endpoint as Projects Page for consistency
    const [teamMembersRes, projectsRes, attendanceRes, leaveRequestsRes] = await Promise.all([
      axiosInstance.get('/manager/team'),
      axiosInstance.get('/projects'), // SAME as Projects Page - returns ALL projects
      axiosInstance.get('/manager/team-attendance'),
      axiosInstance.get('/manager/team-leaves')
    ]);

    return {
      teamMembers: teamMembersRes.data.data || [],
      projects: projectsRes.data.data || [], // SAME data as Projects Page
      attendance: attendanceRes.data.data || [],
      leaveRequests: leaveRequestsRes.data.data || []
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    throw error;
  }
};
