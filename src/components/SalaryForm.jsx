import { useEffect, useState } from "react";

function SalaryForm({ onSave, editingSalary, employees }) {
  const [formData, setFormData] = useState({
    emp_id: "",
    salary_amount: "",
    effective_from: "",
    effective_to: "",
    change_reason: "",
    status: "Active"
  });

  useEffect(() => {
    if (editingSalary) {
      setFormData({
        emp_id: editingSalary.emp_id ? editingSalary.emp_id.toString() : "",
        salary_amount: editingSalary.salary_amount ? editingSalary.salary_amount.toString() : "",
        effective_from: editingSalary.effective_from?.split("T")[0] || "",
        effective_to: editingSalary.effective_to?.split("T")[0] || "",
        change_reason: editingSalary.change_reason || "",
        status: editingSalary.status || "Active"
      });
    } else {
      // Reset form when not editing
      setFormData({
        emp_id: "",
        salary_amount: "",
        effective_from: "",
        effective_to: "",
        change_reason: "",
        status: "Active"
      });
    }
  }, [editingSalary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent decimal input for salary amount
    if (name === 'salary_amount') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process form data
    const processedData = {
      emp_id: formData.emp_id && !isNaN(parseInt(formData.emp_id)) ? parseInt(formData.emp_id) : 0,
      salary_amount: formData.salary_amount && !isNaN(parseInt(formData.salary_amount)) ? parseInt(formData.salary_amount) : 0,
      effective_from: formData.effective_from || "",
      effective_to: formData.effective_to || null,
      change_reason: formData.change_reason || "",
      status: formData.status || "Active"
    };

    await onSave(processedData);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {editingSalary ? "Edit Salary Record" : "Add Salary Record"}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee *
          </label>
          <select
            name="emp_id"
            value={formData.emp_id}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.first_name} {emp.last_name} ({emp.email})
              </option>
            ))}
          </select>
        </div>

        {/* Salary Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary Amount *
          </label>
          <input
            type="text"
            name="salary_amount"
            placeholder="0"
            value={formData.salary_amount}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "." || e.key === "-") {
                e.preventDefault();
              }
            }}
            required
            min="0"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Effective From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Effective From *
          </label>
          <input
            type="date"
            name="effective_from"
            value={formData.effective_from}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Effective To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Effective To
          </label>
          <input
            type="date"
            name="effective_to"
            value={formData.effective_to}
            onChange={handleChange}
            min={formData.effective_from}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty if currently active</p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Change Reason */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change Reason
          </label>
          <textarea
            name="change_reason"
            placeholder="Reason for salary change (if applicable)"
            value={formData.change_reason}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-3">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {editingSalary ? "Update Salary Record" : "Add Salary Record"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SalaryForm;