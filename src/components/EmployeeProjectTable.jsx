import { Pencil, Trash2 } from 'lucide-react';
import IconButton from './IconButton';

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
                <IconButton
                  icon={Pencil}
                  onClick={() => onEdit(a)}
                  variant="primary"
                  title="Edit Assignment"
                />

                <IconButton
                  icon={Trash2}
                  onClick={() => onDelete(a.assignment_id)}
                  variant="danger"
                  title="Delete Assignment"
                />
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default EmployeeProjectTable;