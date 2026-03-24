import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    myProjects: 0,
    currentMonthSalary: 0,
    leaveBalance: 0,
    attendanceThisMonth: 0,
    pendingRequests: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState({
    employeeId: '',
    email: '',
    department: '',
    position: ''
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        myEmpRes,
        projectsRes,
        salaryRes,
        leaveRes,
        attendanceRes
      ] = await Promise.all([
        axiosInstance.get('/employees/me'),
        axiosInstance.get('/projects/my/count'),
        axiosInstance.get('/salary-history/current-month'),
        axiosInstance.get('/leave-requests/balance'),
        axiosInstance.get('/attendance/my/month')
      ]);
      
      const myProjects = projectsRes.data.count || 0;
      const currentMonthSalary = salaryRes.data.amount || 0;
      const leaveBalance = leaveRes.data.balance || 0;
      const attendanceThisMonth = attendanceRes.data.days_present || 0;
      const pendingRequests = leaveRes.data.pending || 0;
      
      setStats({
        myProjects,
        currentMonthSalary,
        leaveBalance,
        attendanceThisMonth,
        pendingRequests
      });
      
      setUserProfile({
        employeeId: myEmpRes.data?.employee_code || `EMP${user?.userId || '001'}`,
        email: myEmpRes.data?.email || user?.email || '',
        department: myEmpRes.data?.dept_name || 'Not Assigned',
        position: myEmpRes.data?.position_title || 'Not Assigned'
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Stat Card Component
  const StatCard = ({ title, value, icon, color = 'blue' }) => {
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
                Welcome back, {user?.name || 'Employee'}! 👤
              </h1>
              <p className="text-blue-100">
                Here's your personal information and quick access to your work
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'E'}
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

      {/* Employee Dashboard Content */}
      <div>
        {/* My Information */}
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
              value={`$${stats.currentMonthSalary.toLocaleString()}`}
              icon={<span>💰</span>}
              color="green"
            />
            <StatCard
              title="Leave Balance"
              value={`${stats.leaveBalance} days`}
              icon={<span>🏖️</span>}
              color="purple"
            />
            <StatCard
              title="Attendance This Month"
              value={`${stats.attendanceThisMonth} days`}
              icon={<span>✅</span>}
              color="indigo"
            />
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={<span>📝</span>}
              color="yellow"
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Employee ID</span>
              <span className="font-semibold">{userProfile.employeeId}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Email</span>
              <span className="font-semibold text-sm">{userProfile.email}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Department</span>
              <span className="font-semibold">{userProfile.department}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Position</span>
              <span className="font-semibold">{userProfile.position}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
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

          {/* Recent Activity Placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-gray-500 text-center py-8">
                <p>Your recent activity feed coming soon</p>
                <p className="text-sm mt-2">Check back for your recent work updates and notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
