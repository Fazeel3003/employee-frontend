import { useState, useEffect } from "react";

function PositionForm({ onSave, editingPosition }) {

  const [formData, setFormData] = useState({
    position_title: "",
    min_salary: "",
    max_salary: "",
    dept_id: ""
  });

  useEffect(() => {
    if (editingPosition) {
      setFormData(editingPosition);
    }
  }, [editingPosition]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">

      <input
        name="position_title"
        placeholder="Title"
        value={formData.position_title || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="dept_id"
        placeholder="Department ID"
        value={formData.dept_id || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="min_salary"
        placeholder="Min Salary"
        value={formData.min_salary || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="max_salary"
        placeholder="Max Salary"
        value={formData.max_salary || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <button className="bg-blue-600 text-white py-2 rounded col-span-4">
        {editingPosition ? "Edit Position" : "Create Position"}
      </button>

    </form>
  );
}

export default PositionForm;