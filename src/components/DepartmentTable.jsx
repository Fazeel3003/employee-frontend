import CurrencyDisplay from './CurrencyDisplay';

function DepartmentTable({ departments, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Department Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Location</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Budget</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => (
            <tr key={dept.dept_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{dept.dept_id}</td>
              <td className="px-4 py-3">{dept.dept_name}</td>
              <td className="px-4 py-3">{dept.location || 'Not specified'}</td>

              <td 
                className="px-4 py-3" 
                style={{ color: '#10B981', fontWeight: '600' }}
              >
                {dept.budget 
                  ? `$${parseFloat(dept.budget)
                      .toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`
                  : '$0.00'
                }
              </td>

              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(dept)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(dept.dept_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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

export default DepartmentTable;