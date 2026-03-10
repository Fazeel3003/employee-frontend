import { useEffect, useState } from "react";

function DepartmentForm({ onSave, editingDepartment }) {

  const [formData, setFormData] = useState({
    dept_name: "",
    location: "",
    budget: ""
  });

  useEffect(() => {
    if (editingDepartment) {
      setFormData(editingDepartment);
    }
  }, [editingDepartment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);

    setFormData({
      dept_name: "",
      location: "",
      budget: ""
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {editingDepartment ? "Edit Department" : "Add Department"}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >

        <input
          type="text"
          name="dept_name"
          placeholder="Department Name"
          value={formData.dept_name}
          onChange={handleChange}
          required
          className="border rounded-md px-3 py-2"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="border rounded-md px-3 py-2"
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={formData.budget}
          onChange={handleChange}
          required
          className="border rounded-md px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md md:col-span-3"
        >
          {editingDepartment ? "Update Department" : "Add Department"}
        </button>

      </form>
    </div>
  );
}

export default DepartmentForm;