import { useState, useEffect } from "react";

function LeaveForm({ onSave, editingLeave, employees }) {
  const [formData, setFormData] = useState({
    emp_id: "",
    leave_type: "Sick",
    start_date: "",
    end_date: "",
    reason: ""
  });

  const leaveTypes = [
    { value: "Sick", label: "Sick Leave", icon: "🤒" },
    { value: "Casual", label: "Casual Leave", icon: "🏖️" },
    { value: "Earned", label: "Earned Leave", icon: "💰" },
    { value: "Maternity", label: "Maternity Leave", icon: "🤱" },
    { value: "Paternity", label: "Paternity Leave", icon: "👨‍👦‍👦" },
    { value: "Unpaid", label: "Unpaid Leave", icon: "📋" }
  ];

  useEffect(() => {
    if (editingLeave) {
      setFormData({
        emp_id: editingLeave.emp_id || "",
        leave_type: editingLeave.leave_type || "Sick",
        start_date: editingLeave.start_date?.split("T")[0] || "",
        end_date: editingLeave.end_date?.split("T")[0] || "",
        reason: editingLeave.reason || ""
        // NOTE: Status is NOT included - should only be changed via approve/reject actions
      });
    }
  }, [editingLeave]);

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
      leave_type: "Sick",
      start_date: "",
      end_date: "",
      reason: ""
    });
  };

  const handleCancel = () => {
    setFormData({
      emp_id: "",
      leave_type: "Sick",
      start_date: "",
      end_date: "",
      reason: ""
    });
  };

  // Calculate minimum end date (start date + 1 day)
  const getMinEndDate = () => {
    if (formData.start_date) {
      const startDate = new Date(formData.start_date);
      startDate.setDate(startDate.getDate() + 1);
      return startDate.toISOString().split('T')[0];
    }
    return "";
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {editingLeave ? "Update Leave Request" : "Create Leave Request"}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
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

        <select
          name="leave_type"
          value={formData.leave_type}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-md appearance-none bg-white"
        >
          {leaveTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-md"
        />

        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
          min={getMinEndDate()}
          className="border px-3 py-2 rounded-md"
        />

        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for leave request"
          maxLength="255"
          rows="3"
          className="border px-3 py-2 rounded-md md:col-span-2 resize-none"
        />

        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {editingLeave ? "Update Request" : "Create Request"}
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

export default LeaveForm;
