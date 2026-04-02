import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { getEmployees } from '../api/employeeService';
import { getProjects } from '../api/projectService';
import { getLeaveRequests } from '../api/leaveService';
import { getAttendance } from '../api/attendanceServices';
import { getDepartments } from '../api/departmentService';
import { projectFilters } from '../api/managerService';

const DashboardPage = () => {
  const { user, isAdmin, isManager, isHR, isUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    // Essential stats for 4-card dashboard
    totalEmployees: 0,
    totalDepartments: 0,
    totalProjects: 0,
    activeProjects: 0,
    pendingLeaveRequests: 0,
    todayAttendance: 0,
    newHiresThisMonth: 0,
    projectsCompleted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility function for consistent date formatting
  const formatDateLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        // STEP 1: Measure API response time
        const start = Date.now();
        const healthRes = await axiosInstance.get('/health');
        const responseTime = Date.now() - start;

        // STEP 2: Use same APIs as working pages
        if (isAdmin()) {
          // Use same APIs and logic as individual pages
          const [empRes, projRes, leaveRes, attendanceRes, deptRes] = await Promise.all([
            getEmployees(1, 1000, ""), // Same as EmployeesPage
            getProjects(1, 1000, ""), // Same as ProjectsPage
            getLeaveRequests(1, 1000, ""), // Same as LeavePage
            getAttendance(), // Same as AttendancePage
            getDepartments(1, 1000, "") // Same as DepartmentPage
          ]);
          
          // Apply same data extraction logic as individual pages
          const employeesList = empRes.data?.data || [];
          const projectsList = projRes.data?.data || [];
          const leaveList = leaveRes.data?.data || [];
          const attendanceList = attendanceRes.data || [];
          const departmentsList = deptRes.data?.data || [];
          
          // Same logic as LeavePage and LeaveManagementPage: filter by approval_status === 'pending' or 'Pending'
          const pendingLeaves = leaveList.filter(r => 
            r.approval_status === 'pending' || r.approval_status === 'Pending'
          ).length;
          
          // Same logic as ProjectsPage: use projectFilters.isActive
          const activeProjects = projectsList.filter(p => projectFilters.isActive(p)).length;
          
          // Today's attendance: filter by today's date and status === 'Present' or 'present'
          const today = new Date().toISOString().split('T')[0];
          const todayAttendance = attendanceList.filter(a => 
            formatDateLocal(a.attendance_date) === today && 
            (a.attendance_status === 'Present' || a.attendance_status === 'present')
          ).length;
          
          // New hires this month: copy logic from HR dashboard
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const newHiresThisMonth = employeesList.filter(emp => {
            if (!emp.hire_date) return false;
            try {
              const hireDate = new Date(emp.hire_date);
              if (isNaN(hireDate.getTime())) return false;
              return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
            } catch (error) {
              console.warn('Invalid hire_date for employee:', emp.id, emp.hire_date);
              return false;
            }
          }).length;
          
          // Completed projects: use projectFilters.isCompleted
          const projectsCompleted = projectsList.filter(projectFilters.isCompleted).length;
          
          // set admin stats with real data
          setStats({
            totalEmployees: employeesList.length,
            totalDepartments: departmentsList.length,
            totalProjects: projectsList.length,
            activeProjects,
            pendingLeaveRequests: pendingLeaves,
            todayAttendance,
            newHiresThisMonth,
            projectsCompleted
          });
        
        } else if (isManager()) {
          // ONLY call endpoints manager can access
          const [empRes, activeProjRes, attendanceRes, leaveRes,
            projRes, completedProjRes, newHiresRes, lastActivityRes
          ] = await Promise.all([
            axiosInstance.get('/employees/count'),
            axiosInstance.get('/projects/active/count'),
            axiosInstance.get('/attendance/today/count'),
            axiosInstance.get('/leave-requests/pending/count'),
            axiosInstance.get('/projects/count'),
            axiosInstance.get('/projects/completed/count'),
            axiosInstance.get('/employees/new-hires/count'),
            axiosInstance.get('/health/last-activity')
          ]);
          
          // set manager stats
          setStats({
            teamMembers: empRes.data.count || 0,
            activeProjects: activeProjRes.data.count || 0,
            todayAttendance: attendanceRes.data.count || 0,
            pendingLeaveRequests: leaveRes.data.count || 0,
            totalProjects: projRes.data.count || 0,
            projectsCompleted: completedProjRes.data.count || 0,
            newHiresThisMonth: newHiresRes.data.count || 0,
            lastActivity: lastActivityRes.data.display || '—'
          });
          
        } else if (isHR()) {
          // ONLY call endpoints HR can access — NO salary/total or salary/count
          const [empRes, activeProjRes, leaveRes, attendanceRes,
            newHiresRes, completedProjRes, lastActivityRes
          ] = await Promise.all([
            axiosInstance.get('/employees/count'),
            axiosInstance.get('/projects/active/count'),
            axiosInstance.get('/leave-requests/pending/count'),
            axiosInstance.get('/attendance/today/count'),
            axiosInstance.get('/employees/new-hires/count'),
            axiosInstance.get('/projects/completed/count'),
            axiosInstance.get('/health/last-activity')
          ]);
          
          // set HR stats
          setStats({
            totalEmployees: empRes.data.count || 0,
            activeProjects: activeProjRes.data.count || 0,
            pendingLeaveRequests: leaveRes.data.count || 0,
            todayAttendance: attendanceRes.data.count || 0,
            newHiresThisMonth: newHiresRes.data.count || 0,
            projectsCompleted: completedProjRes.data.count || 0,
            lastActivity: lastActivityRes.data.display || '—'
          });
          
        } else if (isUser()) {
          // ONLY call user endpoints
          const [myEmpRes] = await Promise.all([
            axiosInstance.get('/employees/me')
          ]);
          
          // set user stats from employee record
          setStats({
            myProjects: 0, // Will be implemented later
            currentMonthSalary: 0, // Will be implemented later
            leaveBalance: 0, // Will be implemented later
            userProfile: {
              employeeId: myEmpRes.data?.employee_code || `EMP${user?.userId || '001'}`,
              email: myEmpRes.data?.email || user?.email || '',
              department: myEmpRes.data?.dept_name || 'Engineering',
              position: myEmpRes.data?.position_title || 'Software Developer'
            }
          });
        }
        
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }  
    }; 

    fetchDashboardStats();
  }, [isAdmin, isManager, isHR, isUser]);

  // Stat Card Component
  const StatCard = ({ title, value, icon, color = 'blue', trend = null }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500'
    };

    return (
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-10`}>
            <div className={`w-6 h-6 ${colorClasses[color]} rounded-full flex items-center justify-center text-white`}>
              {icon}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-blue-100 mb-4">
                Here's what's happening with your Employee Management System today
              </p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                  {user?.role === 'admin' ? '👑 Administrator' : 
                   user?.role === 'manager' ? '👨‍💼 Manager' : 
                   user?.role === 'hr' ? '👥‍💼 HR' : '👤 User'}
                </span>
                <span className="text-sm text-blue-100">
                  Last login: {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Role-based Dashboard Content */}
      {isAdmin() && (
        <div>
          {/* Stats Row - 4 Cards Only */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Employees"
                value={stats.totalEmployees}
                icon={<span>👥</span>}
                color="blue"
              />
              <StatCard
                title="Active Projects"
                value={stats.activeProjects}
                icon={<span>�</span>}
                color="indigo"
              />
              <StatCard
                title="Pending Leaves"
                value={stats.pendingLeaveRequests}
                icon={<span>📝</span>}
                color="yellow"
              />
              <StatCard
                title="Today's Attendance"
                value={stats.todayAttendance}
                icon={<span>✅</span>}
                color="green"
              />
            </div>
          </div>

          {/* Two Column Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: System Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total Departments</span>
                  <span className="font-semibold text-blue-600">{stats.totalDepartments}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total Projects</span>
                  <span className="font-semibold text-green-600">{stats.totalProjects}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Completed Projects</span>
                  <span className="font-semibold text-purple-600">{stats.projectsCompleted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">New Hires This Month</span>
                  <span className="font-semibold text-indigo-600">{stats.newHiresThisMonth}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/employees/add')}
                  className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left font-medium"
                >
                  Add Employee
                </button>
                <button 
                  onClick={() => navigate('/departments')}
                  className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left font-medium"
                >
                  Add Department
                </button>
                <button 
                  onClick={() => navigate('/positions')}
                  className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-left font-medium"
                >
                  Manage Positions
                </button>
                <button 
                  onClick={() => navigate('/leave')}
                  className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left font-medium"
                >
                  View Leave Requests
                </button>
                <button 
                  onClick={() => navigate('/attendance')}
                  className="w-full p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-left font-medium"
                >
                  View Attendance
                </button>
                <button 
                  onClick={() => navigate('/salary')}
                  className="w-full p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-left font-medium"
                >
                  View Salary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isManager() && (
        <div>
          {/* Team Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Team Members"
                value={stats.teamMembers}
                icon={<span>👥</span>}
                color="blue"
              />
              <StatCard
                title="Active Projects"
                value={stats.activeProjects}
                icon={<span>📊</span>}
                color="green"
              />
              <StatCard
                title="Today's Attendance"
                value={stats.todayAttendance}
                icon={<span>✅</span>}
                color="indigo"
              />
              <StatCard
                title="Pending Leave Requests"
                value={stats.pendingLeaveRequests}
                icon={<span>📝</span>}
                color="orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/attendance')}
                  className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left font-medium"
                >
                  View Team Attendance
                </button>
                <button 
                  onClick={() => navigate('/leave-requests?filter=pending')}
                  className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left font-medium"
                >
                  Approve Leave Requests
                </button>
                <button 
                  onClick={() => navigate('/projects?action=assign')}
                  className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left font-medium"
                >
                  Assign Projects
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total Projects</span>
                  <span className="font-semibold">{stats.totalProjects}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="font-semibold text-green-600">{stats.activeProjects}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Pending Approvals</span>
                  <span className="font-semibold text-orange-600">{stats.pendingApprovals}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isHR() && (
        <div>
          {/* HR Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">HR Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Employees"
                value={stats.totalEmployees}
                icon={<span>👥</span>}
                color="blue"
                trend={3.2}
              />
              <StatCard
                title="Active Projects"
                value={stats.activeProjects}
                icon={<span>📊</span>}
                color="green"
                trend={5.8}
              />
              <StatCard
                title="Pending Leave Requests"
                value={stats.pendingLeaveRequests}
                icon={<span>📝</span>}
                color="yellow"
                trend={2.1}
              />
              <StatCard
                title="Today's Attendance"
                value={stats.todayAttendance}
                icon={<span>✅</span>}
                color="indigo"
                trend={1.5}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Tasks</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Pending Tasks</span>
                  <span className="font-semibold text-orange-600">{stats.hrTasks}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Pending Reviews</span>
                  <span className="font-semibold text-red-600">{stats.pendingHRReviews}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Open Positions</span>
                  <span className="font-semibold text-blue-600">8</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Policy Updates</span>
                  <span className="font-semibold text-purple-600">2</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/employees/reviews')}
                  className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left font-medium"
                >
                  Employee Reviews
                </button>
                <button 
                  onClick={() => navigate('/policy-updates')}
                  className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left font-medium"
                >
                  Policy Updates
                </button>
                <button 
                  onClick={() => navigate('/hr-analytics')}
                  className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left font-medium"
                >
                  HR Analytics
                </button>
                <button 
                  onClick={() => navigate('/compliance')}
                  className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-left font-medium"
                >
                  Compliance Check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

     {isUser() && (
        <div>
          {/* User Dashboard */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="My Projects"
                value={stats.myProjects}
                icon={<span>📊</span>}
                color="blue"
              />
              <StatCard
                title="This Month's Salary"
                value={<CurrencyDisplay amount={stats.currentMonthSalary} />}
                icon={<span>💰</span>}
                color="green"
              />
              <StatCard
                title="Leave Balance"
                value={`${stats.leaveBalance} days`}
                icon={<span>🏖️</span>}
                color="purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/projects')}
                  className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left font-medium"
                >
                  View My Projects
                </button>
                <button 
                  onClick={() => navigate('/leave-requests/new')}
                  className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left font-medium"
                >
                  Request Leave
                </button>
                <button 
                  onClick={() => navigate('/salary-history')}
                  className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left font-medium"
                >
                  View Salary History
                </button>
                <button 
                  onClick={() => navigate('/attendance')}
                  className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-left font-medium"
                >
                  Mark Attendance
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Employee ID</span>
                  <span className="font-semibold">{stats.userProfile?.employeeId || `EMP${user?.userId || '001'}`}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="font-semibold text-sm">{stats.userProfile?.email || user?.email || ''}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="font-semibold">{stats.userProfile?.department || 'Engineering'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Position</span>
                  <span className="font-semibold">{stats.userProfile?.position || 'Software Developer'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
