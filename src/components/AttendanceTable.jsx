function AttendanceTable({ attendance, employees, onEdit, onDelete }) {
  const getEmployeeName = (empId) => {
    const employee = employees.find(emp => emp.emp_id === empId);
    return employee ? `${employee.first_name} ${employee.last_name}` : `ID: ${empId}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Employee</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Check In</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Check Out</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((record) => (
            <tr key={record.attendance_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{getEmployeeName(record.emp_id)}</td>
              <td className="px-4 py-3">
                {record.attendance_date?.split("T")[0]}
              </td>
              <td className="px-4 py-3">{record.check_in}</td>
              <td className="px-4 py-3">{record.check_out}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  record.attendance_status === 'Present' ? 'bg-green-100 text-green-800' :
                  record.attendance_status === 'Absent' ? 'bg-red-100 text-red-800' :
                  record.attendance_status === 'Leave' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {record.attendance_status}
                </span>
              </td>

              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(record)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(record.attendance_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;