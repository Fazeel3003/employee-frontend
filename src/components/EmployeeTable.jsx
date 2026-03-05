function EmployeeTable({ employees, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
Employee Code
</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">First Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Last Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Hire Date</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.emp_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{emp.employee_code}</td>
              <td className="px-4 py-3">{emp.emp_id}</td>
              <td className="px-4 py-3">{emp.first_name}</td>
              <td className="px-4 py-3">{emp.last_name}</td>
              <td className="px-4 py-3">{emp.email}</td>
              <td className="px-4 py-3">
                {emp.hire_date?.split("T")[0]}
              </td>

              {/* ✅ Actions Column */}
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(emp)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(emp.emp_id)}
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

export default EmployeeTable;