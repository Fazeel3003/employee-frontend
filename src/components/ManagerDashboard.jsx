import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, projectFilters } from '../api/managerService';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    teamMembers: 0,
    activeProjects: 0,
    todaysAttendance: 0,
    absentToday: 0,
    pendingLeaves: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      // Debug logs (TEMPORARY)
      console.log("USER:", user);
      
      // Fetch manager-specific dashboard data with error handling
      const dashboardData = await getDashboardData();
      
      console.log("Dashboard Data:", dashboardData);
      
      // Calculate stats from real data with fallbacks
      const teamMembers = dashboardData.teamMembers || [];
      
      // Use centralized filtering utility (same logic as backend)
      const activeProjects = (dashboardData.projects || []).filter(projectFilters.isActive);
      
      console.log("=== DASHBOARD DEBUG ===");
      console.log("Dashboard projects array:", dashboardData.projects);
      console.log("Dashboard projects count:", dashboardData.projects?.length);
      console.log("Active projects filtered:", activeProjects);
      console.log("Active projects count:", activeProjects.length);
      console.log("=== END DASHBOARD DEBUG ===");
      
      const todaysAttendance = dashboardData.attendance || [];
      const pendingLeaves = dashboardData.leaveRequests || [];
      
      console.log("Team Members:", teamMembers);
      console.log("Filtered Team:", teamMembers);
      
      const presentCount = todaysAttendance.filter(
        att => att.attendance_status === 'Present' || att.status === 'Present'
      ).length;
      
      const absentCount = teamMembers.length - presentCount;
      
      setStats({
        teamMembers: teamMembers.length,
        activeProjects: activeProjects.length,
        todaysAttendance: presentCount,
        absentToday: absentCount,
        pendingLeaves: pendingLeaves.length
      });
      
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setError('Failed to load dashboard data. Please try again.');
      
      // Set default values on error to prevent crashes
      setStats({
        teamMembers: 0,
        activeProjects: 0,
        todaysAttendance: 0,
        absentToday: 0,
        pendingLeaves: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

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
                Welcome back, {user?.name || 'Manager'}! 👨‍💼
              </h1>
              <p className="text-blue-100">
                Here's your team overview and today's status
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'M'}
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

      {/* Manager Dashboard Content */}
      <div>
        {/* Top Stats Cards */}
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
              value={`${stats.todaysAttendance} Present / ${stats.absentToday} Absent`}
              icon={<span>✅</span>}
              color="indigo"
            />
            <StatCard
              title="Pending Leave Requests"
              value={stats.pendingLeaves}
              icon={<span>📝</span>}
              color="yellow"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/projects')}
              className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left font-medium"
            >
              Create Project
            </button>
            <button 
              onClick={() => navigate('/employees')}
              className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left font-medium"
            >
              View Team Members
            </button>
            <button 
              onClick={() => navigate('/leave')}
              className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-left font-medium"
            >
              View Leave Requests
            </button>
            <button 
              onClick={() => navigate('/reports')}
              className="p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-left font-medium"
            >
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
