import { useState, useEffect } from "react";
import { getEmployees } from "../api/employeeService";
import { getProjects } from "../api/projectService";

function EmployeeProjectForm({ onSave, editingAssignment }) {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    emp_id: "",
    project_id: "",
    role_name: "",
    allocation_percent: 100,
    assigned_on: "",
    released_on: ""
  });

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        emp_id: editingAssignment.emp_id || "",
        project_id: editingAssignment.project_id || "",
        role_name: editingAssignment.role_name || "",
        allocation_percent: editingAssignment.allocation_percent || 100,
        assigned_on: editingAssignment.assigned_on?.split("T")[0] || "",
        released_on: editingAssignment.released_on?.split("T")[0] || ""
      });
    }
  }, [editingAssignment]);

  const fetchDropdowns = async () => {
    try {
      const empRes = await getEmployees();
      const projRes = await getProjects();

      setEmployees(empRes.data.data || []);
      setProjects(projRes.data.data || []);
    } catch (error) {
      console.error("Dropdown fetch failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSave(formData);

    setFormData({
      emp_id: "",
      project_id: "",
      role_name: "",
      allocation_percent: 100,
      assigned_on: "",
      released_on: ""
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {editingAssignment ? "Update Assignment" : "Assign Employee to Project"}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >

        <select
          name="emp_id"
          value={formData.emp_id}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.emp_id} value={emp.emp_id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>

        <select
          name="project_id"
          value={formData.project_id}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        >
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj.project_id} value={proj.project_id}>
              {proj.project_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="role_name"
          placeholder="Role"
          value={formData.role_name}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          name="allocation_percent"
          placeholder="Allocation %"
          value={formData.allocation_percent}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          name="assigned_on"
          value={formData.assigned_on}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          name="released_on"
          value={formData.released_on}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded md:col-span-3"
        >
          {editingAssignment ? "Save Assignment" : "Create Assignment"}
        </button>

      </form>
    </div>
  );
}

export default EmployeeProjectForm;