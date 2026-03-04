function EmployeeTable({ employees }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">First Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Last Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Hire Date</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.emp_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{emp.emp_id}</td>
              <td className="px-4 py-3">{emp.first_name}</td>
              <td className="px-4 py-3">{emp.last_name}</td>
              <td className="px-4 py-3">{emp.email}</td>
              <td className="px-4 py-3">
                {emp.hire_date?.split("T")[0]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;