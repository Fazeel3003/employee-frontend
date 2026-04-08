import CurrencyDisplay from './CurrencyDisplay';
import { Pencil, Trash2 } from 'lucide-react';
import IconButton from './IconButton';

function SalaryTable({ salaryHistory, employees, onDelete, onEdit, canManageAll = false }) {
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
                {canManageAll ? (
                  <>
                    <IconButton
                      icon={Pencil}
                      onClick={() => onEdit(record)}
                      variant="primary"
                      title="Edit Salary Record"
                    />

                    <IconButton
                      icon={Trash2}
                      onClick={() => onDelete(record.salary_id)}
                      variant="danger"
                      title="Delete Salary Record"
                    />
                  </>
                ) : (
                  <span className="text-xs text-gray-400">View only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalaryTable;
