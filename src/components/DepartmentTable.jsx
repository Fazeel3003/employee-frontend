import CurrencyDisplay from './CurrencyDisplay';
import { Pencil, Trash2 } from 'lucide-react';
import IconButton from './IconButton';

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

              <td className="px-4 py-3">
                <CurrencyDisplay amount={dept.budget} />
              </td>

              <td className="px-4 py-3 space-x-2">
                <IconButton
                  icon={Pencil}
                  onClick={() => onEdit(dept)}
                  variant="primary"
                  title="Edit Department"
                />

                <IconButton
                  icon={Trash2}
                  onClick={() => onDelete(dept.dept_id)}
                  variant="danger"
                  title="Delete Department"
                />
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DepartmentTable;