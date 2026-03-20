import { useEffect, useState, useCallback } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectTable from "../components/ProjectTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from "../api/projectService";
import { useModal } from "../context/ModalContext";
import toast from "react-hot-toast";

function ProjectsPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const { showConfirmDelete, showSuccess, showError } = useModal();

  const itemsPerPage = 10;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects(1, 1000, ""); // Fetch all for frontend filtering
      
      const projectsData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      
      setAllProjects(projectsData);
      
    } catch (err) {
      console.error("Fetch projects error:", err);
      setError("Failed to fetch projects");
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Search filter logic
  const filteredProjects = allProjects.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.project_name?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query)
    );
  });

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Pagination for filtered results
  const totalPagesFiltered = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
        toast.success('Project updated successfully!', {
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
        const result = await createProject(processedData);
        
        // Reset form by incrementing key AFTER successful creation
        setFormKey(prev => prev + 1);
        toast.success('Project added successfully!', {
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

      // Reset search and page
      setSearchQuery('');
      setPage(1);
      await fetchProjects();
    } catch (error) {
      console.error("Frontend save error:", error);
      toast.error('Failed to save project. Try again.', {
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

  const handleDelete = async (id) => {
    const project = allProjects.find(p => p.project_id === id);
    const projectName = project ? project.project_name : 'this project';
    
    showConfirmDelete(
      projectName,
      async () => {
        try {
          await deleteProject(id);
          toast('Project deleted successfully!', {
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
          // Reset search and page
          setSearchQuery('');
          setPage(1);
          await fetchProjects();
        } catch (error) {
          toast.error('Failed to delete project. Try again.', {
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
      `Project ID: ${id}\nName: ${projectName}\nStatus: ${project?.status || 'Unknown'}`
    );
  };

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
    if (searchQuery.trim() === "") {
      fetchProjects(1, "");
    } else {
      const cleanup = debouncedSearch(searchQuery);
      return cleanup;
    }
  }, [searchQuery, debouncedSearch]);

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
        {/* SEARCH BAR */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {allProjects.length} projects
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by project name or status..."
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            {filteredProjects.length === 0 && searchQuery && (
              <div style={{
                textAlign: 'center',
                padding: '48px',
                color: '#6B7280'
              }}>
                <p style={{ fontSize: '16px' }}>
                  🔍 No results found for "{searchQuery}"
                </p>
                <p style={{ fontSize: '14px' }}>
                  Try different keywords or clear the search
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Clear Search
                </button>
              </div>
            )}

            {filteredProjects.length > 0 && (
              <>
                <ProjectTable
                  projects={paginatedProjects}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
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

export default ProjectsPage;