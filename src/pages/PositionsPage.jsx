import { useEffect, useState, useCallback } from "react";
import PositionTable from "../components/PositionTable";
import PositionForm from "../components/PositionForm";
import Pagination from "../components/Pagination";
import { useModal } from "../context/ModalContext";
import { formatCurrency } from "../utils/currencyFormatter";
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition
} from "../api/positionService";

function PositionsPage() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showConfirmDelete, showSuccess, showError } = useModal();
  const [search, setSearch] = useState("");
  const [editingPosition, setEditingPosition] = useState(null);

  const fetchPositions = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);
      const response = await getPositions(pageNum, 10, searchQuery);
      
      setPositions(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
      
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
      
    } catch (err) {
      setError("Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions(page, search);
  }, [page, search]);

  // ===============================
  // ADD / UPDATE POSITION
  // ===============================
  const handleSavePosition = async (data) => {
    try {
      if (editingPosition) {
        await updatePosition(editingPosition.position_id, data);
        setEditingPosition(null);
      } else {
        await createPosition(data);
      }

      fetchPositions(page, search);
    } catch (error) {
      setError("Save failed");
    }
  };

  // ===============================
  // DELETE POSITION
  // ===============================
  const handleDeletePosition = async (id) => {
    const position = positions.find(pos => pos.position_id === id);
    const positionTitle = position?.position_title || 'this position';
    
    showConfirmDelete(
      positionTitle,
      async () => {
        try {
          await deletePosition(id);
          fetchPositions();
          showSuccess("Position deleted successfully!");
        } catch (error) {
          showError("Failed to delete position. Please try again.");
        }
      },
      `Position ID: ${id}\nTitle: ${positionTitle}\nDepartment: ${position?.department || 'N/A'}\nMin Salary: ${formatCurrency(position?.min_salary)}\nMax Salary: ${formatCurrency(position?.max_salary)}`
    );
  };

  // ===============================
  // EDIT CLICK
  // ===============================
  const handleEditPosition = useCallback((position) => {
    setEditingPosition(position);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchValue) => {
      const timer = setTimeout(() => {
        setPage(1);
        setSearch(searchValue);
      }, 300);
      return () => clearTimeout(timer);
    },
    []
  );

  // Handle search input with debouncing
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    const cleanup = debouncedSearch(value);
    return cleanup;
  }, [debouncedSearch]);

  const handlePageChange = useCallback((pageNumber) => {
    setPage(pageNumber);
    fetchPositions(pageNumber, search);
  }, [search]);

  useEffect(() => {
    if (search.trim() === "") {
      fetchPositions(1, "");
    } else {
      const cleanup = debouncedSearch(search);
      return cleanup;
    }
  }, [search, debouncedSearch]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Positions</h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <PositionForm
          onSave={handleSavePosition}
          editingPosition={editingPosition}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search positions..."
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
            <PositionTable
              positions={positions}
              onEdit={handleEditPosition}
              onDelete={handleDeletePosition}
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

export default PositionsPage;