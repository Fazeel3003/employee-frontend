import { useEffect, useState } from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceTable from "../components/AttendanceTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from "../api/attendanceServices";
import { getEmployees } from "../api/employeeService";

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchStatus, setSearchStatus] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: '',
    attendance_date: new Date().toISOString().split('T')[0],
    check_in: '',
    check_out: '',
    attendance_status: 'Present'
  });
  const { showConfirmDelete, showSuccess, showError } = useModal();
  const { isAdmin, isHR, isManager, isUser, isLoading: authLoading } = useAuth();
  const canManageAll = isAdmin() || isHR() || isManager();

  const itemsPerPage = 10;

  // Fetch data on mount
  useEffect(() => {
    if (!authLoading) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          if (isManager()) {
            const [attendRes, teamEmpRes] = await Promise.all([
              getAttendance(),
              axiosInstance.get('/attendance/team-employees')
            ]);
            setAttendance(attendRes.data?.data || []);
            setEmployees(teamEmpRes.data?.data || []);
            
          } else if (isAdmin() || isHR()) {
            const [attendRes, empRes] = await Promise.all([
              getAttendance(),
              getEmployees()
            ]);
            setAttendance(attendRes.data?.data || []);
            setEmployees(empRes.data?.data || empRes.data || []);
            
          } else {
            const attendRes = await getAttendance();
            setAttendance(attendRes.data?.data || []);
            setEmployees([]);
          }
          
        } catch (err) {
          console.error('Failed to load attendance data:', err);
          toast.error('Failed to load attendance data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [authLoading]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchEmployee, searchDate, searchStatus]);

  const formatDateLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter logic
  const filteredAttendance = attendance.filter(a => {
    const name = `${a.first_name} ${a.last_name} ${a.employee_code}`.toLowerCase();
    const empMatch = searchEmployee === '' || name.includes(searchEmployee.toLowerCase());
    
    const dateMatch = searchDate === '' || 
      formatDateLocal(a.attendance_date) === searchDate;
    
    const statusMatch = searchStatus === 'all' || a.attendance_status === searchStatus;
    
    return empMatch && dateMatch && statusMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const paginated = filteredAttendance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayStats = {
    present: attendance.filter(a => 
      formatDateLocal(a.attendance_date) === today && 
      a.attendance_status === 'Present').length,
    absent: attendance.filter(a => 
      formatDateLocal(a.attendance_date) === today && 
      a.attendance_status === 'Absent').length,
    halfDay: attendance.filter(a => 
      formatDateLocal(a.attendance_date) === today && 
      a.attendance_status === 'Half Day').length,
    total: attendance.length
  };

  const handleSave = async (data) => {
    try {
      if (isEditing) {
        await updateAttendance(editingId, data);
        setIsEditing(false);
        setEditingId(null);
        toast.success('Attendance updated successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '10px',
            padding: '16px 24px',
          }
        });
      } else {
        await createAttendance(data);
        toast.success('Attendance marked successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '10px',
            padding: '16px 24px',
          }
        });
        setCurrentPage(1);
      }

      // Reset form and refetch
      setFormData({
        emp_id: '',
        attendance_date: new Date().toISOString().split('T')[0],
        check_in: '',
        check_out: '',
        attendance_status: 'Present'
      });
      
      // Refetch attendance with role-based logic
      if (isManager()) {
        const [attendRes, teamEmpRes] = await Promise.all([
          getAttendance(),
          axiosInstance.get('/attendance/team-employees')
        ]);
        setAttendance(attendRes.data?.data || []);
        setEmployees(teamEmpRes.data?.data || []);
      } else if (isAdmin() || isHR()) {
        const [attendRes, empRes] = await Promise.all([
          getAttendance(),
          getEmployees()
        ]);
        setAttendance(attendRes.data?.data || []);
        setEmployees(empRes.data?.data || empRes.data || []);
      } else {
        const attendRes = await getAttendance();
        setAttendance(attendRes.data?.data || []);
      }

    } catch (error) {
      console.error('Save attendance error:', error);
      if (error.response?.data?.message?.includes('already marked')) {
        toast('⚠️ Attendance already marked for this employee on this date!', {
          duration: 4000,
          icon: '⚠️',
          style: {
            background: '#F59E0B',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '10px',
            padding: '16px 24px',
          }
        });
      } else {
        toast.error('Failed to process attendance. Try again.', {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '10px',
            padding: '16px 24px',
          }
        });
      }
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingId(record.attendance_id);
    setFormData({
      emp_id: record.emp_id,
      attendance_date: record.attendance_date,
      check_in: record.check_in || '',
      check_out: record.check_out || '',
      attendance_status: record.attendance_status
    });
  };

  const handleDelete = async (id) => {
    const record = attendance.find(a => a.attendance_id === id);
    const recordDetails = record ? 
      `${record.first_name} ${record.last_name} - ${record.attendance_date}` : 
      'this attendance record';
    
    showConfirmDelete(
      recordDetails,
      async () => {
        try {
          await deleteAttendance(id);
          toast('Attendance record deleted!', {
            duration: 4000,
            icon: '🗑️',
            style: {
              background: '#F97316',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '10px',
              padding: '16px 24px',
            }
          });
          
          // Update local state
          setAttendance(attendance.filter(a => a.attendance_id !== id));
          
        } catch (error) {
          console.error('Delete attendance error:', error);
          toast.error('Failed to delete attendance. Try again.', {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '10px',
              padding: '16px 24px',
            }
          });
        }
      },
      `Attendance ID: ${id}\nEmployee: ${record?.first_name || 'N/A'} ${record?.last_name || 'N/A'}\nDate: ${record?.attendance_date || 'N/A'}\nCheck In: ${record?.check_in || 'N/A'}\nCheck Out: ${record?.check_out || 'N/A'}\nStatus: ${record?.attendance_status || 'N/A'}`
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      emp_id: '',
      attendance_date: new Date().toISOString().split('T')[0],
      check_in: '',
      check_out: '',
      attendance_status: 'Present'
    });
  };

  const clearFilters = () => {
    setSearchEmployee('');
    setSearchDate('');
    setSearchStatus('all');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Present': 'bg-green-100 text-green-800',
      'Absent': 'bg-red-100 text-red-800',
      'Leave': 'bg-yellow-100 text-yellow-800',
      'Half Day': 'bg-blue-100 text-blue-800',
      'Late': 'bg-orange-100 text-orange-800',
      'Early Leave': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Attendance Management</h2>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Present Today</div>
          <div className="text-2xl font-bold text-green-600">{todayStats.present}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Absent Today</div>
          <div className="text-2xl font-bold text-red-600">{todayStats.absent}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Half Day Today</div>
          <div className="text-2xl font-bold text-blue-600">{todayStats.halfDay}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Total Records</div>
          <div className="text-2xl font-bold text-gray-600">{todayStats.total}</div>
        </div>
      </div>

      {/* FORM */}
      {canManageAll && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <AttendanceForm
            onSave={handleSave}
            editingAttendance={isEditing ? { attendance_id: editingId, ...formData } : null}
            employees={employees}
            canManageAll={canManageAll}
          />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-6">
        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-4">
          {canManageAll && (
            <div className="flex-1 min-w-48">
              <SearchBar
                value={searchEmployee}
                onChange={setSearchEmployee}
                placeholder="Search by employee name or code..."
              />
            </div>
          )}
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Filter by date"
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
            <option value="Half Day">Half Day</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {filteredAttendance.length === 0 && (searchEmployee || searchDate || searchStatus !== 'all') && (
              <div style={{
                textAlign: 'center',
                padding: '48px',
                color: '#6B7280'
              }}>
                <p style={{ fontSize: '16px' }}>
                  � No attendance records found matching your filters
                </p>
                <p style={{ fontSize: '14px' }}>
                  Try different filter criteria or clear all filters
                </p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {filteredAttendance.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginated.map((record) => (
                        <tr key={record.attendance_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {record.first_name} {record.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ({record.employee_code})
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(record.attendance_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {record.check_in || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {record.check_out || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(record.attendance_status)}`}>
                              {record.attendance_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {canManageAll ? (
                              <>
                                <button
                                  onClick={() => handleEdit(record)}
                                  className="bg-blue-500 text-white px-3 py-1 rounded-md 
                                    hover:bg-blue-600 text-sm mr-3"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(record.attendance_id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-md 
                                    hover:bg-red-600 text-sm"
                                >
                                  Delete
                                </button>
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm italic">No actions available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;