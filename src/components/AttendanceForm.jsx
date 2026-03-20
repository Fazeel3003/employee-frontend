import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function AttendanceForm({ onSave, editingAttendance, employees, canManageAll }) {

  const [formData, setFormData] = useState({
    emp_id: "",
    attendance_date: "",
    check_in: "",
    check_out: "",
    attendance_status: "Present"
  });
  const [userEmpId, setUserEmpId] = useState(null);

  useEffect(() => {
    if (editingAttendance) {
      setFormData({
        emp_id: editingAttendance.emp_id || "",
        attendance_date: editingAttendance.attendance_date?.split("T")[0] || "",
        check_in: editingAttendance.check_in || "",
        check_out: editingAttendance.check_out || "",
        attendance_status: editingAttendance.attendance_status || "Present"
      });
    }
  }, [editingAttendance]);

  useEffect(() => {
    if (!canManageAll) {
      axiosInstance.get('/employees/me')
        .then(res => setUserEmpId(res.data.data?.emp_id))
        .catch(err => console.error('Could not fetch emp_id', err));
    }
  }, [canManageAll]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = canManageAll ? formData : { ...formData, emp_id: userEmpId };
    onSave(submissionData);

    setFormData({
      emp_id: "",
      attendance_date: "",
      check_in: "",
      check_out: "",
      attendance_status: "Present"
    });
  };

  return (
    <div>

      <h3 className="text-lg font-semibold mb-4">
        {editingAttendance ? "Update Attendance" : "Create Attendance"}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >

        {canManageAll && (
          <select
            name="emp_id"
            value={formData.emp_id}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-md appearance-none bg-white"
          >
            <option value="">Employee ▼</option>
            {employees.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
        )}

        <input
          type="date"
          name="attendance_date"
          value={formData.attendance_date}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded-md"
        />

        <input
          type="time"
          name="check_in"
          value={formData.check_in}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md"
        />

        <input
          type="time"
          name="check_out"
          value={formData.check_out}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md"
        />

        <select
          name="attendance_status"
          value={formData.attendance_status}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
          <option value="Half Day">Half Day</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md md:col-span-5"
        >
          {editingAttendance ? "Update Attendance" : "Create Attendance"}
        </button>

      </form>
    </div>
  );
}

export default AttendanceForm;