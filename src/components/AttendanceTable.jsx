import { Pencil, Trash2 } from 'lucide-react';
import IconButton from './IconButton';

function AttendanceTable({ attendance, employees, onEdit, onDelete }) {
  const getEmployeeName = (empId) => {
    if (!empId) return 'N/A';
    
    const employee = employees && employees.find(emp => emp.emp_id === empId);
    if (employee) {
      return `${employee.first_name || ''} ${employee.last_name || ''}`.trim() || `ID: ${empId}`;
    }
    return `ID: ${empId}`;
  };

  // Handle empty attendance array
  if (!attendance || attendance.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-lg font-medium">No attendance records found</div>
        <div className="text-sm mt-2">Try adjusting your filters or check back later.</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Employee</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Check In</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Check Out</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((record) => {
            if (!record) return null;
            
            return (
              <tr key={record.attendance_id || Math.random()} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{getEmployeeName(record.emp_id)}</td>
                <td className="px-4 py-3">
                  {record.attendance_date ? record.attendance_date.split("T")[0] : 'N/A'}
                </td>
                <td className="px-4 py-3">{record.check_in || 'N/A'}</td>
                <td className="px-4 py-3">{record.check_out || 'N/A'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.attendance_status === 'Present' ? 'bg-green-100 text-green-800' :
                    record.attendance_status === 'Absent' ? 'bg-red-100 text-red-800' :
                    record.attendance_status === 'Leave' ? 'bg-yellow-100 text-yellow-800' :
                    record.attendance_status === 'Half Day' ? 'bg-blue-100 text-blue-800' :
                    record.attendance_status === 'Late' ? 'bg-orange-100 text-orange-800' :
                    record.attendance_status === 'Early Leave' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.attendance_status || 'N/A'}
                  </span>
                </td>

                <td className="px-4 py-3 space-x-2">
                  <IconButton
                    icon={Pencil}
                    onClick={() => onEdit(record)}
                    variant="primary"
                    title="Edit Attendance"
                  />

                  <IconButton
                    icon={Trash2}
                    onClick={() => onDelete(record.attendance_id)}
                    variant="danger"
                    title="Delete Attendance"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;