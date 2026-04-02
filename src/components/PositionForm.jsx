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
    } else {
      // Reset form when not editing
      setFormData({
        position_title: "",
        min_salary: "",
        max_salary: "",
        dept_id: ""
      });
    }
  }, [editingPosition]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent decimal input for salary fields
    if (name === 'min_salary' || name === 'max_salary') {
      // Allow only whole numbers
      const wholeNumberValue = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: wholeNumberValue
      });
      return;
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    setFormData({
      position_title: "",
      min_salary: "",
      max_salary: "",
      dept_id: ""
    });
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
        type="text"
        placeholder="Min Salary"
        value={formData.min_salary || ""}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "." || e.key === "-") {
            e.preventDefault();
          }
        }}
        className="border p-2 rounded"
      />

      <input
        name="max_salary"
        type="text"
        placeholder="Max Salary"
        value={formData.max_salary || ""}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "." || e.key === "-") {
            e.preventDefault();
          }
        }}
        className="border p-2 rounded"
      />

      <button className="bg-blue-600 text-white py-2 rounded col-span-4">
        {editingPosition ? "Edit Position" : "Create Position"}
      </button>

    </form>
  );
}

export default PositionForm;