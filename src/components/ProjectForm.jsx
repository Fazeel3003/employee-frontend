import { useEffect, useState } from "react";

function ProjectForm({ onSave, editingProject }) {
  const [formData, setFormData] = useState({
    project_name: "",
    start_date: "",
    end_date: "",
    budget: "0",
    status: "Planned",
    project_manager_id: "0"
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        project_name: editingProject.project_name || "",
        start_date: editingProject.start_date?.split("T")[0] || "",
        end_date: editingProject.end_date?.split("T")[0] || "",
        budget: editingProject.budget ? editingProject.budget.toString() : "0",
        status: editingProject.status || "Planned",
        project_manager_id: editingProject.project_manager_id ? editingProject.project_manager_id.toString() : ""
      });
    }
  }, [editingProject]);

  useEffect(() => {
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a copy of the data to avoid reset issues
    const dataToSubmit = {...formData};
    
    // Call onSave with the copied data
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
          type="number"
          name="budget"
          placeholder="Budget"
          value={formData.budget}
          onChange={handleChange}
          min="0"
          step="0.01"
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

        <input
          type="number"
          name="project_manager_id"
          placeholder="Manager ID"
          value={formData.project_manager_id}
          onChange={handleChange}
          min="1"
          className="border px-3 py-2 rounded"
        />

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