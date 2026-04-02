import CurrencyDisplay from './CurrencyDisplay';
import { useAuth } from '../context/AuthContext';

function ProjectTable({ projects, onDelete, onEdit }) {
  const { isAdmin, isHR, isManager, isUser } = useAuth();
  const canManageProjects = isAdmin() || isHR();
  const canSeeBudget = isAdmin() || isHR();
  const canDelete = isAdmin() || isHR();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Project Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Start</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">End</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              {canManageProjects ? 'Budget' : 'Allocation'}
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Manager</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.project_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{p.project_id}</td>
              <td className="px-4 py-3">{p.project_name}</td>
              <td className="px-4 py-3">{p.start_date?.split("T")[0]}</td>
              <td className="px-4 py-3">{p.end_date?.split("T")[0]}</td>
              <td className="px-4 py-3">
                {canSeeBudget ? (
                  <CurrencyDisplay amount={p.budget} />
                ) : (
                  <span className="text-sm text-gray-600">
                    {p.allocation_percent || 0}%
                  </span>
                )}
              </td>
              <td className="px-4 py-3">{p.status}</td>
              <td className="px-4 py-3">{p.project_manager_id}</td>

              <td className="px-4 py-3 space-x-2">
                {canManageProjects && (
                  <button
                    onClick={() => onEdit(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(p.project_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default ProjectTable;