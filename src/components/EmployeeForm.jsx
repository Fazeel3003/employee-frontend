import { useState } from "react";

function EmployeeForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    hire_date: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onEmployeeAdded(formData);

    // Clear form after submit
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      hire_date: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Add Employee</h3>

      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="hire_date"
        value={formData.hire_date}
        onChange={handleChange}
        required
      />

      <button type="submit">Add</button>
    </form>
  );
}

export default EmployeeForm;
