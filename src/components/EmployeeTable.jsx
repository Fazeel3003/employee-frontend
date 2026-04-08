import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Pencil, Trash2 } from 'lucide-react';
import IconButton from './IconButton';

function EmployeeTable({ employees, onDelete, onEdit }) {
  const { isAdmin, isHR } = useAuth();
  const canManageEmployees = isAdmin() || isHR();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  // Fetch departments and positions for mapping
  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const [deptRes, posRes] = await Promise.all([
          axiosInstance.get('/departments'),
          axiosInstance.get('/positions')
        ]);
        setDepartments(Array.isArray(deptRes.data.data) ? deptRes.data.data : deptRes.data);
        setPositions(Array.isArray(posRes.data.data) ? posRes.data.data : posRes.data);
      } catch (error) {
        console.error('Failed to fetch mappings:', error);
      }
    };
    
    fetchMappings();
  }, []);

  // Helper functions to get names by ID
  const getDepartmentName = (deptId) => {
    if (!deptId) return 'N/A';
    const dept = departments.find(d => d.dept_id === parseInt(deptId));
    return dept ? dept.dept_name : 'N/A';
  };

  const getPositionName = (positionId) => {
    if (!positionId) return 'N/A';
    const position = positions.find(p => p.position_id === parseInt(positionId));
    return position ? position.position_title : 'N/A';
  };

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
                {getDepartmentName(emp.dept_id)}
              </td>
              
              <td className="px-4 py-3 text-gray-600">
                {getPositionName(emp.position_id)}
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
                {canManageEmployees ? (
                  <>
                    <IconButton
                      icon={Pencil}
                      onClick={() => onEdit(emp)}
                      variant="primary"
                      title="Edit Employee"
                    />

                    <IconButton
                      icon={Trash2}
                      onClick={() => onDelete(emp.emp_id)}
                      variant="danger"
                      title="Delete Employee"
                    />
                  </>
                ) : (
                  <span className="text-xs text-gray-400">
                    View only
                  </span>
                )}
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