import { useEffect, useState } from "react";
import SalaryForm from "../components/SalaryForm";
import SalaryTable from "../components/SalaryTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { useModal } from "../context/ModalContext";
import { formatCurrency } from "../utils/currencyFormatter";
import toast from "react-hot-toast";
import {
  getSalaryHistory,
  createSalaryHistory,
  updateSalaryHistory,
  deleteSalaryHistory
} from "../api/salaryService";
import { getEmployees } from "../api/employeeService";
import { useAuth } from "../context/AuthContext";

function SalaryPage() {
  const [allSalaryHistory, setAllSalaryHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const { showConfirmDelete } = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSalary, setEditingSalary] = useState(null);
  const { isAdmin, isHR } = useAuth();
  const canManageAll = isAdmin() || isHR();

  const itemsPerPage = 10;

  const clearFilters = () => {
    setSearchQuery('');
    setPage(1);
  };

  const fetchEmployees = async () => {
    try {
      if (!canManageAll) return;
      const response = await getEmployees(1, 1000, "");
      const employeeList = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setEmployees(employeeList);
    } catch (err) {
      setError("Failed to fetch employees");
    }
  };

  const fetchSalaryHistory = async () => {
    try {
      setLoading(true);
      const response = await getSalaryHistory(1, 1000, "");
      const salaryList = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setAllSalaryHistory(salaryList);
    } catch (err) {
      setError("Failed to fetch salary history");
      setAllSalaryHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchSalaryHistory();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const filteredSalaryHistory = allSalaryHistory.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.first_name?.toLowerCase().includes(query) ||
      item.last_name?.toLowerCase().includes(query) ||
      item.change_reason?.toLowerCase().includes(query)
    );
  });

  const totalPagesFiltered = Math.ceil(filteredSalaryHistory.length / itemsPerPage);
  const paginatedSalaryHistory = filteredSalaryHistory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSaveSalary = async (data) => {
    try {
      if (editingSalary) {
        await updateSalaryHistory(editingSalary.salary_id, data);
        setEditingSalary(null);
        toast.success('Salary record updated successfully!', {
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
        await createSalaryHistory(data);
        toast.success('Salary record added successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '10px',
            padding: '16px 24px',
          }
        });
      }
      setSearchQuery('');
      setPage(1);
      await fetchSalaryHistory();
    } catch (error) {
      toast.error('Failed to save salary record. Try again.', {
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
  };

  const handleDeleteSalary = async (id) => {
    const salaryRecord = allSalaryHistory.find(sr => sr.salary_id === id);
    const salaryDetails = salaryRecord
      ? `Salary for ${salaryRecord.first_name || ''} ${salaryRecord.last_name || ''} (${formatCurrency(salaryRecord.salary_amount)})`
      : 'this salary record';

    showConfirmDelete(
      salaryDetails,
      async () => {
        try {
          await deleteSalaryHistory(id);
          toast.success('Salary record deleted successfully!', {
            duration: 4000,
            style: {
              background: '#10B981',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '10px',
              padding: '16px 24px',
            }
          });
          setSearchQuery('');
          setPage(1);
          await fetchSalaryHistory();
        } catch (error) {
          toast.error('Failed to delete salary record. Try again.', {
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
      `Salary ID: ${id}\nEmployee: ${salaryRecord?.first_name || ''} ${salaryRecord?.last_name || ''}\nAmount: ${formatCurrency(salaryRecord?.salary_amount)}\nEffective Date: ${salaryRecord?.effective_date?.split('T')[0] || 'N/A'}\nPayment Method: ${salaryRecord?.payment_method || 'N/A'}\nStatus: ${salaryRecord?.status || 'N/A'}`
    );
  };

  const handleEditSalary = (item) => {
    setEditingSalary(item);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Salary History</h2>

      {canManageAll && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <SalaryForm
            onSave={handleSaveSalary}
            editingSalary={editingSalary}
            employees={employees}
          />
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {filteredSalaryHistory.length} of {allSalaryHistory.length} salary records
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by employee name or reason..."
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
            <p className="font-semibold">Error:</p>
            <p>{error.message || error}</p>
          </div>
        ) : (
          <>
            {filteredSalaryHistory.length === 0 && searchQuery && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>
                <p style={{ fontSize: '16px' }}>
                  No results found for {searchQuery}
                </p>
                <p style={{ fontSize: '14px' }}>
                  Try different keywords or clear all filters
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {filteredSalaryHistory.length > 0 && (
              <>
                <SalaryTable
                  salaryHistory={paginatedSalaryHistory}
                  employees={employees}
                  onEdit={handleEditSalary}
                  onDelete={handleDeleteSalary}
                />
                <Pagination
                  page={page}
                  totalPages={totalPagesFiltered}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SalaryPage;