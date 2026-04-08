import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react';
import IconButton from './IconButton';

function LeaveTable({ leaveRequests, employees, onDelete, onEdit, onApprove, onReject, canApprove }) {
  const { isAdmin, isHR, isManager, isUser } = useAuth();
  const canApproveActions = canApprove !== undefined 
    ? canApprove 
    : (isAdmin() || isHR() || isManager());

  const getEmployeeName = (empId, item) => {
    return item.first_name && item.last_name 
      ? `${item.first_name} ${item.last_name}` 
      : item.employee_name 
      ? item.employee_name
      : `Employee #${item.emp_id}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getLeaveTypeIcon = (type) => {
    const icons = {
      'Sick': '🤒',
      'Casual': '🏖️',
      'Earned': '💰',
      'Maternity': '🤱',
      'Paternity': '👨‍👦‍👦',
      'Unpaid': '📋'
    };
    
    return icons[type] || '📄';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Employee</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Leave Type</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Start Date</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">End Date</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Reason</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Requested At</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.leave_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">
                {getEmployeeName(request.emp_id, request)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>{getLeaveTypeIcon(request.leave_type)}</span>
                  <span className="font-medium">{request.leave_type}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {request.start_date?.split("T")[0]}
              </td>
              <td className="px-4 py-3">
                {request.end_date?.split("T")[0]}
              </td>
              <td className="px-4 py-3">
                <span className="text-gray-600 text-sm line-clamp-2">
                  {request.reason || "-"}
                </span>
              </td>
              <td className="px-4 py-3">
                {getStatusBadge(request.approval_status)}
              </td>
              <td className="px-4 py-3">
                {request.requested_at?.split("T")[0]}
              </td>
              <td className="px-4 py-3 space-x-2">
  {request.approval_status === 'Pending' ? (
    <>
      {canApproveActions && (
        <IconButton
          icon={CheckCircle}
          onClick={() => onApprove(request.leave_id)}
          variant="success"
          title="Approve Leave"
        />
      )}
      {canApproveActions && (
        <IconButton
          icon={XCircle}
          onClick={() => onReject(request.leave_id)}
          variant="danger"
          title="Reject Leave"
        />
      )}
      {(isAdmin() || isHR() || isUser()) && (
        <IconButton
          icon={Pencil}
          onClick={() => onEdit(request)}
          variant="primary"
          title="Edit Leave"
        />
      )}
      {(isAdmin() || isHR() || isUser()) && (
        <IconButton
          icon={Trash2}
          onClick={() => onDelete(request.leave_id)}
          variant="danger"
          title="Delete Leave"
        />
      )}
    </>
  ) : (
    <span className="text-gray-400 text-sm italic">
      No actions available
    </span>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveTable;
