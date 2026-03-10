import { useEffect, useState, useCallback } from "react";
import DepartmentTable from "../components/DepartmentTable";
import DepartmentForm from "../components/DepartmentForm";
import { useModal } from "../context/ModalContext";
import { formatCurrency } from "../utils/currencyFormatter";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "../api/departmentService";

// Custom hook for department search functionality
const useDepartmentSearch = () => {
  const [allDepartments, setAllDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(null);
  const { showConfirmDelete, showSuccess, showError } = useModal();

  // Fetch all departments once
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getDepartments(1, 1000, ""); // Get all departments
      
      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Invalid response from server");
      }
      
      const data = response.data.data || [];
      setAllDepartments(Array.isArray(data) ? data : []);
      setFilteredDepartments(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error("Department fetch error:", err);
      setError(err.message || "Failed to fetch departments");
      setAllDepartments([]);
      setFilteredDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter departments based on search term
  const filterDepartments = useCallback((term) => {
    if (!term.trim()) {
      setFilteredDepartments(allDepartments);
      return;
    }

    const filtered = allDepartments.filter(dept => 
      dept.dept_name?.toLowerCase().includes(term.toLowerCase()) ||
      dept.location?.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredDepartments(filtered);
  }, [allDepartments]);

  // Handle search input changes
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterDepartments(value);
  }, [filterDepartments]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setFilteredDepartments(allDepartments);
  }, [allDepartments]);

  // Handle CRUD operations
  const handleSaveDepartment = useCallback(async (data) => {
    try {
      setError(null);
      if (editingDepartment) {
        await updateDepartment(editingDepartment.dept_id, data);
        setEditingDepartment(null);
      } else {
        await createDepartment(data);
      }
      fetchDepartments(); // Refresh all departments
    } catch (error) {
      console.error("Save error:", error);
      setError(error.message || "Save failed");
    }
  }, [fetchDepartments, editingDepartment]);

  const handleDeleteDepartment = useCallback(async (id) => {
    const department = allDepartments.find(dept => dept.dept_id === id);
    const departmentName = department?.dept_name || 'this department';
    
    showConfirmDelete(
      departmentName,
      async () => {
        try {
          await deleteDepartment(id);
          fetchDepartments();
          showSuccess("Department deleted successfully!");
        } catch (error) {
          showError("Failed to delete department. Please try again.");
        }
      },
      `Department ID: ${id}\nName: ${departmentName}\nLocation: ${department?.location || 'N/A'}\nBudget: ${formatCurrency(department?.budget)}`
    );
  }, [allDepartments, fetchDepartments, showConfirmDelete, showSuccess, showError]);

  const handleEditDepartment = useCallback((dept) => {
    setEditingDepartment(dept);
  }, []);

  return {
    // State
    departments: filteredDepartments,
    loading,
    error,
    searchTerm,
    editingDepartment,
    
    // Actions
    handleSearch,
    handleClearSearch,
    handleSaveDepartment,
    handleDeleteDepartment,
    handleEditDepartment,
    setEditingDepartment,
    fetchDepartments
  };
};

function DepartmentsPage() {
  const {
    departments,
    loading,
    error,
    searchTerm,
    editingDepartment,
    handleSearch,
    handleClearSearch,
    handleSaveDepartment,
    handleDeleteDepartment,
    handleEditDepartment,
    setEditingDepartment,
    fetchDepartments
  } = useDepartmentSearch();

  // Initial load
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Departments</h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <DepartmentForm
          onSave={handleSaveDepartment}
          editingDepartment={editingDepartment}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Enhanced Search Bar */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by department name or location..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search departments"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Enhanced State Display */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Searching departments...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-600 font-medium mb-2">Error loading departments</p>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button
                onClick={fetchDepartments}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : departments.length === 0 && searchTerm ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-600 font-medium mb-2">No departments found</p>
              <p className="text-gray-500 text-sm mb-4">
                Try adjusting your search terms or clear search to see all departments
              </p>
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Clear Search
              </button>
            </div>
          ) : departments.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-600 font-medium mb-2">No departments yet</p>
              <p className="text-gray-500 text-sm mb-4">
                Get started by adding your first department
              </p>
            </div>
          ) : (
            <DepartmentTable
              departments={departments}
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DepartmentsPage;