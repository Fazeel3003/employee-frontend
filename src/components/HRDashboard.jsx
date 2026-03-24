import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const HRDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeProjects: 0,
    pendingLeaveRequests: 0,
    todayAttendance: 0,
    newHiresThisMonth: 0,
    projectsCompleted: 0,
    pendingReviews: 0,
    openPositions: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        empRes,
        activeProjRes,
        leaveRes,
        attendanceRes,
        newHiresRes,
        completedProjRes
      ] = await Promise.all([
        axiosInstance.get('/employees/count'),
        axiosInstance.get('/projects/active/count'),
        axiosInstance.get('/leave-requests/pending/count'),
        axiosInstance.get('/attendance/today/count'),
        axiosInstance.get('/employees/new-hires/count'),
        axiosInstance.get('/projects/completed/count')
      ]);
      
      setStats({
        totalEmployees: empRes.data.count || 0,
        activeProjects: activeProjRes.data.count || 0,
        pendingLeaveRequests: leaveRes.data.count || 0,
        todayAttendance: attendanceRes.data.count || 0,
        newHiresThisMonth: newHiresRes.data.count || 0,
        projectsCompleted: completedProjRes.data.count || 0,
        pendingReviews: 0, // Would come from reviews API
        openPositions: 8  // Would come from positions API
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
                Welcome back, {user?.name || 'HR'}! 👥‍💼
              </h1>
              <p className="text-blue-100">
                Here's your HR overview and team management insights
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'H'}
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

      {/* HR Dashboard Content */}
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
            />
            <StatCard
              title="Active Projects"
              value={stats.activeProjects}
              icon={<span>📊</span>}
              color="green"
            />
            <StatCard
              title="Pending Leave Requests"
              value={stats.pendingLeaveRequests}
              icon={<span>📝</span>}
              color="yellow"
            />
            <StatCard
              title="Today's Attendance"
              value={stats.todayAttendance}
              icon={<span>✅</span>}
              color="indigo"
            />
            <StatCard
              title="New Hires This Month"
              value={stats.newHiresThisMonth}
              icon={<span>🆕</span>}
              color="purple"
            />
            <StatCard
              title="Projects Completed"
              value={stats.projectsCompleted}
              icon={<span>🎯</span>}
              color="green"
            />
            <StatCard
              title="Pending Reviews"
              value={stats.pendingReviews}
              icon={<span>📋</span>}
              color="red"
            />
            <StatCard
              title="Open Positions"
              value={stats.openPositions}
              icon={<span>🏢</span>}
              color="blue"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                onClick={() => navigate('/employees/reviews')}
                className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left font-medium"
              >
                Employee Reviews
              </button>
              <button 
                onClick={() => navigate('/leave-requests')}
                className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left font-medium"
              >
                Manage Leave Requests
              </button>
              <button 
                onClick={() => navigate('/positions')}
                className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-left font-medium"
              >
                Manage Positions
              </button>
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Activities</h3>
            <div className="space-y-3">
              <div className="text-gray-500 text-center py-8">
                <p>HR activity feed coming soon</p>
                <p className="text-sm mt-2">Check back for employee reviews and policy updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
