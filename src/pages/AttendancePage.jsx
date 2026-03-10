import { useEffect, useState } from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceTable from "../components/AttendanceTable";
import Pagination from "../components/Pagination";
import { useModal } from "../context/ModalContext";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showConfirmDelete, showSuccess, showError } = useModal();
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filterMode, setFilterMode] = useState(""); // "exact" or "year"
  const [editingAttendance, setEditingAttendance] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees(1, 1000, ""); // Get all employees for dropdown
      setEmployees(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
    } catch (err) {
      setError("Failed to fetch employees");
    }
  };

  const fetchAttendance = async (pageNum = 1, empId = "", date = "") => {
    try {
      setLoading(true);
      // Fetch all data without filters (since backend doesn't support filtering)
      const response = await getAttendance(1, 1000, "", "");
      
      let filteredData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      
      // Apply client-side filtering
      if (empId) {
        filteredData = filteredData.filter(record => record.emp_id == empId);
      }
      
      if (date) {
        const exactDateMatches = filteredData.filter(record => {
          const attendanceDate = record.attendance_date?.split("T")[0];
          return attendanceDate === date;
        });
        
        if (exactDateMatches.length > 0) {
          // If exact date matches found, show only those
          filteredData = exactDateMatches;
          setFilterMode("exact");
        } else {
          // If no exact date matches, show all records for that year
          const selectedYear = new Date(date).getFullYear();
          filteredData = filteredData.filter(record => {
            const attendanceYear = new Date(record.attendance_date).getFullYear();
            return attendanceYear === selectedYear;
          });
          setFilterMode("year");
        }
      } else {
        setFilterMode("");
      }
      
      // Apply pagination to filtered data
      const startIndex = (pageNum - 1) * 10;
      const endIndex = startIndex + 10;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setAttendance(paginatedData);
      setPage(pageNum);
      setTotalPages(Math.ceil(filteredData.length / 10));
      
    } catch (err) {
      setError("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0 || page === 1) {
      fetchAttendance(page, searchEmployee, searchDate);
    }
  }, [page, searchEmployee, searchDate, employees.length]);

  const handleSaveAttendance = async (data) => {
    try {

      if (editingAttendance) {
        await updateAttendance(editingAttendance.attendance_id, data);
        setEditingAttendance(null);
      } else {
        await createAttendance(data);
      }

      fetchAttendance(page, searchEmployee, searchDate);

    } catch (error) {
      setError("Save failed");
    }
  };

  const handleDeleteAttendance = async (id) => {
    const record = attendance.find(r => r.attendance_id === id);
    const recordDetails = record ? `Attendance for ${record.emp_name || `Employee ${record.emp_id}`} on ${record.attendance_date?.split('T')[0]}` : 'this attendance record';
    
    showConfirmDelete(
      recordDetails,
      async () => {
        try {
          await deleteAttendance(id);
          fetchAttendance(page, searchEmployee, searchDate);
          showSuccess("Attendance record deleted successfully!");
        } catch (error) {
          showError("Failed to delete attendance record. Please try again.");
        }
      },
      `Record ID: ${id}\nEmployee: ${record?.emp_name || `Employee ${record?.emp_id}`}\nDate: ${record?.attendance_date?.split('T')[0] || 'N/A'}`
    );
  };

  const handleEditAttendance = (item) => {
    setEditingAttendance(item);
  };

  return (
    <div>

      <h2 className="text-2xl font-bold mb-6">Attendance</h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <AttendanceForm
          onSave={handleSaveAttendance}
          editingAttendance={editingAttendance}
          employees={employees}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex gap-4 items-center mb-4">
          <div className="relative">
            <select
              value={searchEmployee}
              onChange={(e) => {
                setSearchEmployee(e.target.value);
                setPage(1);
              }}
              className="border px-3 py-2 pr-8 rounded-md w-48 appearance-none bg-white"
            >
              <option value="">Search Employee 🔍</option>
              {employees.map((emp) => (
                <option key={emp.emp_id} value={emp.emp_id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => {
                setSearchDate(e.target.value);
                setPage(1);
              }}
              className="border px-3 py-2 rounded-md w-40"
            />
          </div>
          
          <button
            onClick={() => {
              setSearchEmployee("");
              setSearchDate("");
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear
          </button>
        </div>

        {/* Filter Mode Indicator */}
        {filterMode && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                {filterMode === "exact" 
                  ? `📅 Showing exact date matches for ${searchDate}`
                  : `📅 No records found for ${searchDate}. Showing all records for ${new Date(searchDate).getFullYear()}`
                }
              </span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            <AttendanceTable
              attendance={attendance}
              employees={employees}
              onEdit={handleEditAttendance}
              onDelete={handleDeleteAttendance}
            />
            
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

    </div>
  );
}

export default AttendancePage;