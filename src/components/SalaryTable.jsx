import CurrencyDisplay from './CurrencyDisplay';

function SalaryTable({ salaryHistory, employees, onDelete, onEdit }) {
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
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Salary Amount</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Effective From</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Effective To</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Change Reason</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Created At</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {salaryHistory.map((record) => (
            <tr key={record.salary_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">
                {getEmployeeName(record.emp_id)}
              </td>
              <td className="px-4 py-3">
                <CurrencyDisplay amount={record.salary_amount} />
              </td>
              <td className="px-4 py-3">
                {record.effective_from?.split("T")[0]}
              </td>
              <td className="px-4 py-3">
                {record.effective_to?.split("T")[0] || "Present"}
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-600 text-sm">
                  {record.change_reason || "-"}
                </span>
              </td>
              <td className="px-4 py-3">
                {record.created_at?.split("T")[0]}
              </td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(record)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(record.salary_id)}
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

export default SalaryTable;
