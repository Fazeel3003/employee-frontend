import { useEffect, useState, useCallback } from "react";
import EmployeeProjectForm from "../components/EmployeeProjectForm";
import EmployeeProjectTable from "../components/EmployeeProjectTable";
import Pagination from "../components/Pagination";
import { useModal } from "../context/ModalContext";
import {
  getEmployeeProjects,
  createEmployeeProject,
  updateEmployeeProject,
  deleteEmployeeProject
} from "../api/employeeProjectService";

function EmployeeProjectsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);
  const { showConfirmDelete, showSuccess, showError } = useModal();

  const fetchAssignments = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);
      const response = await getEmployeeProjects(pageNum, 10, searchQuery);
      
      setAssignments(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
      
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
      
    } catch (err) {
      setError("Failed to fetch employee projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchAssignments(page, search);
    }
  }, [page]);

  const handleSave = async (data) => {
    try {
      if (editingAssignment) {
        await updateEmployeeProject(editingAssignment.assignment_id, data);
        setEditingAssignment(null);
      } else {
        await createEmployeeProject(data);
      }

      fetchAssignments(page, search);
    } catch (error) {
      setError("Save failed");
    }
  };

  const handleDelete = async (id) => {
    const assignment = assignments.find(a => a.assignment_id === id);
    const assignmentDetails = assignment ? `${assignment.employee_name || `Employee ${assignment.emp_id}`} - ${assignment.project_name || `Project ${assignment.project_id}`} (${assignment.role_name})` : 'this assignment';
    
    showConfirmDelete(
      assignmentDetails,
      async () => {
        try {
          await deleteEmployeeProject(id);
          fetchAssignments(page, search);
          showSuccess("Assignment deleted successfully!");
        } catch (error) {
          showError("Failed to delete assignment. Please try again.");
        }
      },
      `Assignment ID: ${id}\nEmployee: ${assignment?.employee_name || `Employee ${assignment?.emp_id}`}\nProject: ${assignment?.project_name || `Project ${assignment?.project_id}`}\nRole: ${assignment?.role_name || 'N/A'}\nAllocation: ${assignment?.allocation_percent || 'N/A'}%`
    );
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const debouncedSearch = useCallback(
    (searchValue) => {
      const timer = setTimeout(() => {
        fetchAssignments(1, searchValue);
      }, 500);
      return () => clearTimeout(timer);
    },
    []
  );

  useEffect(() => {
    if (search.trim() === "") {
      fetchAssignments(1, "");
    } else {
      const cleanup = debouncedSearch(search);
      return cleanup;
    }
  }, [search, debouncedSearch]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Employee Project Assignments
      </h2>

      <div className="bg-white shadow rounded p-6 mb-6">

        <EmployeeProjectForm
          onSave={handleSave}
          editingAssignment={editingAssignment}
        />

      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search assignments..."
            className="border px-3 py-2 rounded-md w-64"
          />
          <button
            onClick={() => {
              setSearch("");
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
            <EmployeeProjectTable
              assignments={assignments}
              onEdit={setEditingAssignment}
              onDelete={handleDelete}
            />
            
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

    </div>
  );
}

export default EmployeeProjectsPage;