// ReportsPage.jsx - Reports from FastAPI Microservice (direct API calls)
import { useState, useEffect, useCallback } from 'react';
import {
    getEmployeesJSON,
    getDepartmentSummary,
    getAttendanceSummary,
    downloadEmployeesCSV,
    downloadEmployeesExcel,
    downloadAttendanceCSV,
} from '../api/reportsService';

const TABS = ['Employees', 'Departments', 'Attendance'];

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];

const PRESETS = [
    { label: 'Today', getValue: () => ({ start_date: fmt(today), end_date: fmt(today) }) },
    {
        label: 'Last 7 Days',
        getValue: () => ({ start_date: fmt(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)), end_date: fmt(today) }),
    },
    {
        label: 'Last 30 Days',
        getValue: () => ({ start_date: fmt(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)), end_date: fmt(today) }),
    },
    {
        label: 'This Month',
        getValue: () => ({
            start_date: fmt(new Date(today.getFullYear(), today.getMonth(), 1)),
            end_date: fmt(today),
        }),
    },
    { label: 'Custom', getValue: null },
];

const defaultDates = PRESETS[2].getValue();

function ReportsPage() {
    const [activeTab, setActiveTab] = useState('Employees');
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dates, setDates] = useState(defaultDates);
    const [activePreset, setActivePreset] = useState('Last 30 Days');
    const [dateError, setDateError] = useState(null);
    const [exportingAttendance, setExportingAttendance] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'Employees') {
                const res = await getEmployeesJSON();
                setEmployees(res.data.data || []);
            } else if (activeTab === 'Departments') {
                const res = await getDepartmentSummary();
                setDepartments(res.data.data || []);
            } else if (activeTab === 'Attendance') {
                const res = await getAttendanceSummary(dates.start_date, dates.end_date);
                setAttendance(res.data.data || []);
            }
        } catch (err) {
            setError('Failed to fetch data from Reports Service. Make sure it is running on port 8001.');
            console.error('Reports fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, dates]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const triggerDownload = (blob, filename) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleDownload = async (type) => {
        try {
            const res = type === 'csv' ? await downloadEmployeesCSV() : await downloadEmployeesExcel();
            triggerDownload(res.data, type === 'csv' ? 'employees_export.csv' : 'employees_export.xlsx');
        } catch (err) {
            console.error('Download error:', err);
            setError('Download failed. Make sure the Reports Service is running.');
        }
    };

    const handleAttendanceExport = async () => {
        setExportingAttendance(true);
        try {
            const res = await downloadAttendanceCSV(dates.start_date, dates.end_date);
            const filename = `attendance_report_${dates.start_date}_to_${dates.end_date}.csv`;
            triggerDownload(res.data, filename);
        } catch (err) {
            console.error('Attendance export error:', err);
            setError('Attendance export failed. Make sure the Reports Service is running.');
        } finally {
            setExportingAttendance(false);
        }
    };

    const handlePreset = (preset) => {
        setActivePreset(preset.label);
        if (preset.getValue) {
            const newDates = preset.getValue();
            setDates(newDates);
            setDateError(null);
        }
    };

    const handleCustomDate = (field, value) => {
        setActivePreset('Custom');
        const newDates = { ...dates, [field]: value };
        if (newDates.start_date && newDates.end_date && newDates.end_date < newDates.start_date) {
            setDateError('End date cannot be before start date.');
        } else {
            setDateError(null);
            setDates(newDates);
        }
    };

    const attendanceTotals = attendance.reduce(
        (acc, row) => ({
            total: acc.total + (row.total_records || 0),
            present: acc.present + (row.present || 0),
            absent: acc.absent + (row.absent || 0),
            half_day: acc.half_day + (row.half_day || 0),
        }),
        { total: 0, present: 0, absent: 0, half_day: 0 }
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">Reports</h2>
            <p className="text-gray-600 mb-6">Generate and export reports from the EMS Reports Microservice</p>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-gray-200">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full border-4 border-blue-600 border-t-transparent h-10 w-10"></div>
                </div>
            )}

            {/* Employees Tab */}
            {!loading && activeTab === 'Employees' && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Employee Data
                            <span className="ml-2 text-sm font-normal text-gray-500">({employees.length} records)</span>
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleDownload('csv')}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                                Export CSV
                            </button>
                            <button
                                onClick={() => handleDownload('excel')}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                                Export Excel
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Code', 'First Name', 'Last Name', 'Email', 'Department', 'Position', 'Status', 'Hire Date'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((emp) => (
                                    <tr key={emp.employee_code} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">{emp.employee_code}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{emp.first_name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{emp.last_name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{emp.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{emp.department || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{emp.position || '-'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                emp.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {emp.hire_date ? new Date(emp.hire_date).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {employees.length === 0 && (
                            <p className="text-center py-8 text-gray-500">No employee data found.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Departments Tab */}
            {!loading && activeTab === 'Departments' && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Department Summary
                        <span className="ml-2 text-sm font-normal text-gray-500">({departments.length} departments)</span>
                    </h3>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-blue-600 font-medium">Total Departments</p>
                            <p className="text-2xl font-bold text-blue-900">{departments.length}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-sm text-green-600 font-medium">Total Employees</p>
                            <p className="text-2xl font-bold text-green-900">
                                {departments.reduce((sum, d) => sum + (d.employee_count || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-sm text-purple-600 font-medium">Avg Active %</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {departments.length
                                    ? (departments.reduce((sum, d) => sum + (parseFloat(d.active_percentage) || 0), 0) / departments.length).toFixed(1)
                                    : 0}%
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Department', 'Employee Count', 'Active %'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {departments.map((dept) => (
                                    <tr key={dept.dept_name} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.dept_name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{dept.employee_count}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${Math.min(parseFloat(dept.active_percentage) || 0, 100)}%` }}
                                                    />
                                                </div>
                                                <span>{parseFloat(dept.active_percentage || 0).toFixed(1)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {departments.length === 0 && (
                            <p className="text-center py-8 text-gray-500">No department data found.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Attendance Tab */}
            {!loading && activeTab === 'Attendance' && (
                <div className="bg-white shadow rounded-lg p-6">

                    {/* Preset Quick Filters */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => handlePreset(preset)}
                                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                                    activePreset === preset.label
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                                }`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    {/* Custom Date Inputs */}
                    <div className="flex flex-wrap items-end gap-4 mb-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={dates.start_date}
                                max={dates.end_date}
                                onChange={(e) => handleCustomDate('start_date', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={dates.end_date}
                                min={dates.start_date}
                                max={fmt(today)}
                                onChange={(e) => handleCustomDate('end_date', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    {dateError && (
                        <p className="text-red-500 text-sm mb-4">{dateError}</p>
                    )}

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Total Records</p>
                            <p className="text-2xl font-bold text-blue-900 mt-1">{attendanceTotals.total}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Present</p>
                            <p className="text-2xl font-bold text-green-900 mt-1">{attendanceTotals.present}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                            <p className="text-xs text-red-600 font-medium uppercase tracking-wide">Absent</p>
                            <p className="text-2xl font-bold text-red-900 mt-1">{attendanceTotals.absent}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide">Half Day</p>
                            <p className="text-2xl font-bold text-yellow-900 mt-1">{attendanceTotals.half_day}</p>
                        </div>
                    </div>

                    {/* Table Header with Export */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Attendance Summary
                            <span className="ml-2 text-sm font-normal text-gray-500">({attendance.length} records)</span>
                        </h3>
                        <button
                            onClick={handleAttendanceExport}
                            disabled={exportingAttendance || attendance.length === 0}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exportingAttendance ? 'Exporting...' : 'Export CSV'}
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Date', 'Department', 'Total', 'Present', 'Absent', 'Half Day'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendance.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {row.date ? new Date(row.date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{row.department || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{row.total_records}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                {row.present}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                                {row.absent}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                {row.half_day}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {attendance.length === 0 && (
                            <p className="text-center py-8 text-gray-500">No attendance records found for the selected date range.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportsPage;
