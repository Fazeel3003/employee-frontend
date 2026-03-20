function EmployeeTable({ employees, onDelete, onEdit }) {

  // Format date to "Jan 09, 2022" format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status?.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'on leave':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'resigned':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Employee Code
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Full Name
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Email
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Phone
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Department
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Position
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Hire Date
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Status
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.emp_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {emp.employee_code || 'N/A'}
              </td>
              
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">
                  {emp.first_name} {emp.last_name}
                </div>
              </td>
              
              <td className="px-4 py-3 text-gray-600">
                {emp.email}
              </td>
              
              <td className="px-4 py-3 text-gray-600">
                {emp.phone || 'N/A'}
              </td>
              
              <td className="px-4 py-3 text-gray-600">
                {emp.department?.name || emp.department_name || 'N/A'}
              </td>
              
              <td className="px-4 py-3 text-gray-600">
                {emp.position?.name || emp.position_name || 'N/A'}
              </td>
              
              <td className="px-4 py-3 text-gray-600">
                {formatDate(emp.hire_date)}
              </td>
              
              <td className="px-4 py-3">
                <span className={getStatusBadge(emp.status)}>
                  {emp.status || 'N/A'}
                </span>
              </td>

              {/* Actions Column */}
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(emp)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(emp.emp_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {employees.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No employees found.</p>
        </div>
      )}
    </div>
  );
}

export default EmployeeTable;