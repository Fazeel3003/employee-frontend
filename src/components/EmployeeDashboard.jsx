import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    presentToday: 0,
    thisMonthAttendance: 0,
    pendingLeaveRequests: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data for employee...");
      
      // Use only attendance and leave APIs for employees
      const [
        leaveRes,
        attendanceRes
      ] = await Promise.allSettled([
        axiosInstance.get('/leave-requests'),
        axiosInstance.get('/attendance')
      ]);
      
      // Extract data safely from settled promises
      const leaveData = leaveRes.status === 'fulfilled' 
        ? (leaveRes.value.data?.data || [])
        : [];
      const attendanceData = attendanceRes.status === 'fulfilled' 
        ? (attendanceRes.value.data?.data || attendanceRes.value.data || [])
        : [];
      
      console.log("Dashboard API responses:", {
        leaveData,
        attendanceData,
        errors: {
          leave: leaveRes.status === 'rejected' ? leaveRes.reason.message : null,
          attendance: attendanceRes.status === 'rejected' ? attendanceRes.reason.message : null
        }
      });
      
      // Get today's date for filtering
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Calculate counts in frontend
      const presentToday = attendanceData.filter(a => {
        const attendanceDate = a.attendance_date?.split('T')[0];
        return attendanceDate === today && a.attendance_status === 'Present';
      }).length;
      const thisMonthAttendance = attendanceData.filter(a => {
        const attendanceDate = new Date(a.attendance_date);
        return attendanceDate.getMonth() === currentMonth && 
               attendanceDate.getFullYear() === currentYear &&
               a.attendance_status === 'Present';
      }).length;
      const pendingLeaveRequests = leaveData.filter(l => l.status === 'Pending').length;
      
      console.log("Calculated stats:", {
        presentToday,
        thisMonthAttendance,
        pendingLeaveRequests
      });
      
      setStats({
        presentToday,
        thisMonthAttendance,
        pendingLeaveRequests
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Set default values to prevent UI crashes
      setStats({
        presentToday: 0,
        thisMonthAttendance: 0,
        pendingLeaveRequests: 0
      });
      setError('Some dashboard data could not be loaded');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Get user display name
  const getDisplayName = () => {
    if (!user) return 'Employee';
    if (user.name) return user.name;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    if (user.email) return user.email.split('@')[0];
    return 'Employee';
  };

  // Get user initial
  const getUserInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };
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
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {getDisplayName()}! 👤
              </h1>
              <p className="text-blue-100">
                Here's your work overview and quick actions
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {getUserInitial()}
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

      {/* Dashboard Stats - Clean Grid Layout */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={<span>✅</span>}
            color="green"
          />
          <StatCard
            title="This Month Attendance"
            value={`${stats.thisMonthAttendance} days`}
            icon={<span>📅</span>}
            color="indigo"
          />
          <StatCard
            title="Pending Leave Requests"
            value={stats.pendingLeaveRequests}
            icon={<span>📝</span>}
            color="yellow"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/leave-requests/new')}
            className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-center font-medium"
          >
            <span className="block text-2xl mb-2">🏖️</span>
            Apply Leave
          </button>
          <button 
            onClick={() => navigate('/leave-requests/new')}
            className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
          >
            <span className="block text-2xl mb-2">📝</span>
            Create Leave Request
          </button>
          <button 
            onClick={() => navigate('/attendance')}
            className="p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-center font-medium"
          >
            <span className="block text-2xl mb-2">✅</span>
            Mark Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
