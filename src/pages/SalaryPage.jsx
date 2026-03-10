import { useEffect, useState } from "react";
import SalaryForm from "../components/SalaryForm";
import SalaryTable from "../components/SalaryTable";
import Pagination from "../components/Pagination";
import { useModal } from "../context/ModalContext";
import { formatCurrency } from "../utils/currencyFormatter";
import {
  getSalaryHistory,
  createSalaryHistory,
  updateSalaryHistory,
  deleteSalaryHistory
} from "../api/salaryService";
import { getEmployees } from "../api/employeeService";

function SalaryPage() {
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showConfirmDelete, showSuccess, showError } = useModal();
  const [searchEmployee, setSearchEmployee] = useState("");
  const [editingSalary, setEditingSalary] = useState(null);

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

  const fetchSalaryHistory = async (pageNum = 1, empId = "") => {
    try {
      setLoading(true);
      const response = await getSalaryHistory(pageNum, 10, empId);
      
      setSalaryHistory(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
      
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
      
    } catch (err) {
      setError("Failed to fetch salary history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0 || page === 1) {
      fetchSalaryHistory(page, searchEmployee);
    }
  }, [page, searchEmployee, employees.length]);

  const handleSaveSalary = async (data) => {
    try {
      if (editingSalary) {
        await updateSalaryHistory(editingSalary.salary_id, data);
        setEditingSalary(null);
      } else {
        await createSalaryHistory(data);
      }

      fetchSalaryHistory(page, searchEmployee);

    } catch (error) {
      setError("Save failed");
    }
  };

  const handleDeleteSalary = async (id) => {
    const salaryRecord = salaryHistory.find(sr => sr.salary_id === id);
    const salaryDetails = salaryRecord ? `Salary for ${salaryRecord.emp_name || `Employee ${salaryRecord.emp_id}`} (${formatCurrency(salaryRecord.salary_amount)})` : 'this salary record';
    
    showConfirmDelete(
      salaryDetails,
      async () => {
        try {
          await deleteSalaryHistory(id);
          fetchSalaryHistory(page, searchEmployee);
          showSuccess("Salary record deleted successfully!");
        } catch (error) {
          showError("Failed to delete salary record. Please try again.");
        }
      },
      `Salary ID: ${id}\nEmployee: ${salaryRecord?.emp_name || `Employee ${salaryRecord?.emp_id}`}\nAmount: ${formatCurrency(salaryRecord?.salary_amount)}\nEffective Date: ${salaryRecord?.effective_date?.split('T')[0] || 'N/A'}\nPayment Method: ${salaryRecord?.payment_method || 'N/A'}\nStatus: ${salaryRecord?.status || 'N/A'}`
    );
  };

  const handleEditSalary = (item) => {
    setEditingSalary(item);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Salary History</h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <SalaryForm
          onSave={handleSaveSalary}
          editingSalary={editingSalary}
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
            <SalaryTable
              salaryHistory={salaryHistory}
              employees={employees}
              onEdit={handleEditSalary}
              onDelete={handleDeleteSalary}
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

export default SalaryPage;