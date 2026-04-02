import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

function ProjectForm({ onSave, editingProject }) {
  const { isAdmin, isManager, user } = useAuth();
  const [managerEmpId, setManagerEmpId] = useState(null);
  const [managerName, setManagerName] = useState('');
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    project_name: "",
    start_date: "",
    end_date: "",
    budget: "",
    status: "Planned",
    project_manager_id: ""
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        project_name: editingProject.project_name || "",
        start_date: editingProject.start_date?.split("T")[0] || "",
        end_date: editingProject.end_date?.split("T")[0] || "",
        budget: editingProject.budget ? editingProject.budget.toString() : "",
        status: editingProject.status || "Planned",
        project_manager_id: editingProject.project_manager_id ? editingProject.project_manager_id.toString() : ""
      });
    }
  }, [editingProject]);

  useEffect(() => {
    if (isManager()) {
      // Fetch manager's own employee record
      axiosInstance.get('/employees/me')
        .then(res => {
          const emp = res.data.data;
          setManagerEmpId(emp?.emp_id);
          setManagerName(
            `${emp?.first_name} ${emp?.last_name}` 
          );
        })
        .catch(err => 
          console.error('Could not fetch manager info', err)
        );
    }
    
    if (isAdmin()) {
      // Fetch list of all managers for dropdown
      axiosInstance.get('/employees/managers')
        .then(res => {
          const list = res.data.data || res.data || [];
          setManagers(list);
        })
        .catch(err => 
          console.error('Could not fetch managers', err)
        );
    }
  }, []);

  useEffect(() => {
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent decimal input for budget
    if (name === 'budget') {
      // Allow only whole numbers
      const wholeNumberValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: wholeNumberValue
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a copy of the data to avoid reset issues
    const dataToSubmit = {
      ...formData,
      budget: formData.budget !== "" ? parseInt(formData.budget) : null,
      project_manager_id: isManager() 
        ? managerEmpId 
        : formData.project_manager_id 
        ? parseInt(formData.project_manager_id) 
        : null
    };
    
    // Call onSave with processed data
    onSave(dataToSubmit);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {editingProject ? "Edit Project" : "Add Project"}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          name="project_name"
          placeholder="Project Name"
          value={formData.project_name}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          name="budget"
          placeholder="Enter budget amount"
          value={formData.budget}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "." || e.key === "-") {
              e.preventDefault();
            }
          }}
          min="0"
          className="border px-3 py-2 rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option>Planned</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        {/* Project Manager Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Manager
          </label>
          
          {isAdmin() ? (
            // Admin sees dropdown of all managers
            <select
              name="project_manager_id"
              value={formData.project_manager_id || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            >
              <option value="">Select Project Manager</option>
              {managers.map(mgr => (
                <option key={mgr.emp_id} value={mgr.emp_id}>
                  {mgr.first_name} {mgr.last_name} ({mgr.employee_code})
                </option>
              ))}
            </select>
          ) : isManager() ? (
            // Manager sees read-only field with their name
            <div className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-600 text-sm cursor-not-allowed border-gray-300 flex items-center justify-between">
              <span>
                {managerName || user?.name || 'You'} 
                <span className="text-gray-400 ml-1">(You)</span>
              </span>
              <span className="text-xs text-gray-400 italic">
                Auto-assigned
              </span>
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editingProject ? "Update Project" : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;