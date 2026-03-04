import { useState } from "react";

function EmployeeForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    employee_code:"",
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

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      hire_date: ""
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Add Employee</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* <input
  type="text"
  name="employee_code"
  placeholder="Employee Code"
  value={formData.employee_code}
  onChange={handleChange}
  required
  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
/> */}

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          name="hire_date"
          value={formData.hire_date}
          onChange={handleChange}
          required
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md md:col-span-4"
        >
          Add Employee
        </button>

      </form>
    </div>
  );
}

export default EmployeeForm;