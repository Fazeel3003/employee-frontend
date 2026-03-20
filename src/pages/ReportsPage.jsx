import React from 'react';

const ReportsPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Generate and view various system reports</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Reports</h3>
          <p className="text-gray-600 mb-4">Generate employee attendance, performance, and demographic reports</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Reports</h3>
          <p className="text-gray-600 mb-4">View salary, payroll, and expense reports</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Reports</h3>
          <p className="text-gray-600 mb-4">Analyze project progress, timeline, and resource allocation</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            Generate Report
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No reports generated yet. Use the options above to create your first report.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
