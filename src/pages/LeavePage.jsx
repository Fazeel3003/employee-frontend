import { useEffect, useState } from "react";
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";
import Pagination from "../components/Pagination";
import { useModal } from "../context/ModalContext";
import {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest
} from "../api/leaveService";
import { getEmployees } from "../api/employeeService";

function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showConfirmDelete, showSuccess, showError } = useModal();
  const [searchEmployee, setSearchEmployee] = useState("");
  const [editingLeave, setEditingLeave] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees(1, 1000, "");
      setEmployees(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
    } catch (err) {
      setError("Failed to fetch employees");
    }
  };

  const fetchLeaveRequests = async (pageNum = 1, empId = "") => {
    try {
      setLoading(true);
      const response = await getLeaveRequests(pageNum, 10, empId);
      
      setLeaveRequests(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
      
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
      
    } catch (err) {
      setError("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0 || page === 1) {
      fetchLeaveRequests(page, searchEmployee);
    }
  }, [page, searchEmployee, employees.length]);

  const handleSaveLeave = async (data) => {
    try {
      if (editingLeave) {
        await updateLeaveRequest(editingLeave.leave_id, data);
        setEditingLeave(null);
      } else {
        await createLeaveRequest(data);
      }

      fetchLeaveRequests(page, searchEmployee);

    } catch (error) {
      setError("Save failed");
    }
  };

  const handleDeleteLeave = async (id) => {
    const leaveRequest = leaveRequests.find(lr => lr.leave_id === id);
    const leaveDetails = leaveRequest ? `${leaveRequest.leave_type} leave for ${leaveRequest.emp_name || `Employee ${leaveRequest.emp_id}`} (${leaveRequest.start_date?.split('T')[0]} to ${leaveRequest.end_date?.split('T')[0]})` : 'this leave request';
    
    showConfirmDelete(
      leaveDetails,
      async () => {
        try {
          await deleteLeaveRequest(id);
          fetchLeaveRequests(page, searchEmployee);
          showSuccess("Leave request deleted successfully!");
        } catch (error) {
          showError("Failed to delete leave request. Please try again.");
        }
      },
      `Leave ID: ${id}\nEmployee: ${leaveRequest?.emp_name || `Employee ${leaveRequest?.emp_id}`}\nType: ${leaveRequest?.leave_type || 'N/A'}\nPeriod: ${leaveRequest?.start_date?.split('T')[0] || 'N/A'} to ${leaveRequest?.end_date?.split('T')[0] || 'N/A'}\nReason: ${leaveRequest?.reason || 'N/A'}\nStatus: ${leaveRequest?.approval_status || 'N/A'}`
    );
  };

  const handleEditLeave = (item) => {
    setEditingLeave(item);
  };

  const handleApproveLeave = async (id) => {
    try {
      await approveLeaveRequest(id, 1); // Assuming manager ID is 1 for now
      fetchLeaveRequests(page, searchEmployee);
    } catch (error) {
      setError("Approval failed");
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await rejectLeaveRequest(id, 1); // Assuming manager ID is 1 for now
      fetchLeaveRequests(page, searchEmployee);
    } catch (error) {
      setError("Rejection failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Leave Requests</h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <LeaveForm
          onSave={handleSaveLeave}
          editingLeave={editingLeave}
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
          
          <button
            onClick={() => {
              setSearchEmployee("");
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            <LeaveTable
              leaveRequests={leaveRequests}
              employees={employees}
              onEdit={handleEditLeave}
              onDelete={handleDeleteLeave}
              onApprove={handleApproveLeave}
              onReject={handleRejectLeave}
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

export default LeavePage;