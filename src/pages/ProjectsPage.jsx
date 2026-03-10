import { useEffect, useState, useCallback } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectTable from "../components/ProjectTable";
import Pagination from "../components/Pagination";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from "../api/projectService";
import { useModal } from "../context/ModalContext";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState("");
  const [formKey, setFormKey] = useState(0);
  const { showConfirmDelete, showSuccess, showError } = useModal();

  const fetchProjects = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);
      const response = await getProjects(pageNum, 10, searchQuery);
      
      
      const projectsData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      
      setProjects(projectsData);
      
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
      
    } catch (err) {
      console.error("Fetch projects error:", err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchProjects(page, search);
    }
  }, [page]);

  const handleSave = async (data) => {
    try {
      
      // Convert budget to number and ensure all fields are properly processed
      const processedData = {
        project_name: data.project_name?.trim() || "",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        budget: data.budget && data.budget.trim() !== "" && !isNaN(parseFloat(data.budget)) ? parseFloat(data.budget) : 0,
        status: data.status || "Planned",
        project_manager_id: data.project_manager_id && data.project_manager_id.trim() !== "" && !isNaN(parseInt(data.project_manager_id)) ? parseInt(data.project_manager_id) : 0
      };


      if (editingProject) {
        await updateProject(editingProject.project_id, processedData);
        setEditingProject(null);
        showSuccess("Project updated successfully!");
      } else {
        const result = await createProject(processedData);
        
        // Reset form by incrementing key AFTER successful creation
        setFormKey(prev => prev + 1);
        showSuccess("Project created successfully!");
      }

      fetchProjects(page, search);
    } catch (error) {
      console.error("Frontend save error:", error);
      showError("Failed to save project. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const project = projects.find(p => p.project_id === id);
    const projectName = project?.project_name || 'this project';
    
    showConfirmDelete(
      projectName,
      async () => {
        try {
          await deleteProject(id);
          fetchProjects(page, search);
          showSuccess("Project deleted successfully!");
        } catch (error) {
          showError("Failed to delete project. Please try again.");
        }
      },
      `Project ID: ${id}\nName: ${projectName}\nStatus: ${project?.status || 'Unknown'}`
    );
  };

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const debouncedSearch = useCallback(
    (searchValue) => {
      const timer = setTimeout(() => {
        fetchProjects(1, searchValue);
      }, 500);
      return () => clearTimeout(timer);
    },
    []
  );

  useEffect(() => {
    if (search.trim() === "") {
      fetchProjects(1, "");
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
      <h2 className="text-2xl font-bold mb-6">Projects</h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <ProjectForm
          key={formKey}
          onSave={handleSave}
          editingProject={editingProject}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search projects..."
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
            <ProjectTable
              projects={projects}
              onDelete={handleDelete}
              onEdit={handleEdit}
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

export default ProjectsPage;