import CurrencyDisplay from './CurrencyDisplay';
import { Pencil, Trash2 } from 'lucide-react';
import IconButton from './IconButton';

function PositionTable({ positions, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Title</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Department</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Min Salary</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Max Salary</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {positions.map((pos) => (
            <tr key={pos.position_id} className="border-t">

              <td className="px-4 py-3">{pos.position_id}</td>
              <td className="px-4 py-3">{pos.position_title}</td>
              <td className="px-4 py-3">{pos.dept_id}</td>
              <td className="px-4 py-3">
                <CurrencyDisplay amount={pos.min_salary} />
              </td>
              <td className="px-4 py-3">
                <CurrencyDisplay amount={pos.max_salary} />
              </td>

              <td className="px-4 py-3 space-x-2">
                <IconButton
                  icon={Pencil}
                  onClick={() => onEdit(pos)}
                  variant="primary"
                  title="Edit Position"
                />

                <IconButton
                  icon={Trash2}
                  onClick={() => onDelete(pos.position_id)}
                  variant="danger"
                  title="Delete Position"
                />
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default PositionTable;