import { useEffect, useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../api/employeeService";
import Pagination from "../components/Pagination";
import { useModal } from "../context/ModalContext";

function EmployeesPage() {

  // ===============================
  // STATES
  // ===============================
  const { showConfirmDelete, showSuccess, showError } = useModal();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingEmployee, setEditingEmployee] = useState(null);

  const [search, setSearch] = useState("");

  // ===============================
  // FETCH EMPLOYEES
  // ===============================
  const fetchEmployees = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);

      const response = await getEmployees(pageNum, 10, searchQuery);

      setEmployees(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );

      setPage(response.data.page);
      setTotalPages(response.data.totalPages);

    } catch (err) {
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    fetchEmployees(1, search);
  }, []);

  // ===============================
  // PAGE CHANGE
  // ===============================
  useEffect(() => {
    fetchEmployees(page, search);
  }, [page]);

  // ===============================
  // SEARCH CHANGE
  // ===============================
  useEffect(() => {
    setPage(1);
    fetchEmployees(1, search);
  }, [search]);

  // ===============================
  // ADD OR UPDATE EMPLOYEE
  // ===============================
  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.emp_id, employeeData);
        setEditingEmployee(null);
      } else {
        await createEmployee(employeeData);
      }

      fetchEmployees(page, search);

    } catch (error) {
      console.error("Save failed:", error.response?.data);
    }
  };

  // ===============================
  // DELETE EMPLOYEE
  // ===============================
  const handleDeleteEmployee = async (id) => {
    const employee = employees.find(emp => emp.emp_id === id);
    const employeeName = employee ? `${employee.first_name} ${employee.last_name}` : 'this employee';
    
    showConfirmDelete(
      employeeName,
      async () => {
        try {
          await deleteEmployee(id);
          fetchEmployees(page, search);
          showSuccess("Employee deleted successfully!");
        } catch (error) {
          showError("Failed to delete employee. Please try again.");
        }
      },
      `Employee ID: ${id}\nName: ${employeeName}\nEmail: ${employee?.email || 'N/A'}\nPosition: ${employee?.position || 'N/A'}`
    );
  };

  // ===============================
  // EDIT CLICK
  // ===============================
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
      </div>

      {/* FORM */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <EmployeeForm
          onEmployeeAdded={handleSaveEmployee}
          editingEmployee={editingEmployee}
        />
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-64"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-6">

        {loading && (
          <p className="text-gray-500">Loading employees...</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <>
            <EmployeeTable
              employees={employees}
              onDelete={handleDeleteEmployee}
              onEdit={handleEditEmployee}
            />

            <Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={(newPage) => fetchEmployees(newPage)}
/>

          </>
        )}
      </div>
    </div>
  );
}

export default EmployeesPage;