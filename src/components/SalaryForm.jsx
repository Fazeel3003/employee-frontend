import { useState, useEffect } from "react";

function SalaryForm({ onSave, editingSalary, employees }) {
  const [formData, setFormData] = useState({
    emp_id: "",
    salary_amount: "",
    effective_from: "",
    effective_to: "",
    change_reason: ""
  });

  useEffect(() => {
    if (editingSalary) {
      setFormData({
        emp_id: editingSalary.emp_id || "",
        salary_amount: editingSalary.salary_amount || "",
        effective_from: editingSalary.effective_from?.split("T")[0] || "",
        effective_to: editingSalary.effective_to?.split("T")[0] || "",
        change_reason: editingSalary.change_reason || ""
      });
    }
  }, [editingSalary]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);

    // Reset form
    setFormData({
      emp_id: "",
      salary_amount: "",
      effective_from: "",
      effective_to: "",
      change_reason: ""
    });
  };

  const handleCancel = () => {
    setFormData({
      emp_id: "",
      salary_amount: "",
      effective_from: "",
      effective_to: "",
      change_reason: ""
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {editingSalary ? "Update Salary History" : "Create Salary History"}
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
          className="border px-3 py-2 rounded-md appearance-none bg-white"
        >
          <option value="">Select Employee ▼</option>
          {employees.map((emp) => (
            <option key={emp.emp_id} value={emp.emp_id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="salary_amount"
          value={formData.salary_amount}
          onChange={handleChange}
          placeholder="Salary Amount"
          step="0.01"
          min="0"
          required
          className="border px-3 py-2 rounded-md"
        />

        <input
          type="date"
          name="effective_from"
          value={formData.effective_from}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-md"
        />

        <input
          type="date"
          name="effective_to"
          value={formData.effective_to}
          onChange={handleChange}
          placeholder="Leave empty if current"
          className="border px-3 py-2 rounded-md"
        />

        <input
          type="text"
          name="change_reason"
          value={formData.change_reason}
          onChange={handleChange}
          placeholder="Reason for change"
          maxLength="200"
          className="border px-3 py-2 rounded-md md:col-span-2"
        />

        <div className="flex gap-2 md:col-span-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {editingSalary ? "Update Salary" : "Create Salary"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SalaryForm;
