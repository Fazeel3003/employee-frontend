function EmployeeProjectTable({ assignments, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Employee</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Project</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Role</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Allocation %</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Assigned</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Released</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.assignment_id} className="border-t">

              <td className="px-4 py-3">{a.employee_name || a.emp_id}</td>

              <td className="px-4 py-3">{a.project_name || a.project_id}</td>

              <td className="px-4 py-3">{a.role_name}</td>

              <td className="px-4 py-3">{a.allocation_percent}%</td>

              <td className="px-4 py-3">
                {a.assigned_on?.split("T")[0]}
              </td>

              <td className="px-4 py-3">
                {a.released_on?.split("T")[0]}
              </td>

              <td className="px-4 py-3 space-x-2">

                <button
                  onClick={() => onEdit(a)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(a.assignment_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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

export default EmployeeProjectTable;