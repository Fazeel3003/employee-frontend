import { useEffect, useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import { getEmployees, createEmployee } from "../api/employeeService";

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchEmployees = async () => {
  try {
    setLoading(true);
    const response = await getEmployees();

    console.log("API Response:", response.data);

    setEmployees(
      Array.isArray(response.data.data)
        ? response.data.data
        : []
    );

  } catch (err) {
    setError("Failed to fetch employees");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  // const handleAddEmployee = async (employeeData) => {
  //   try {
  //     await createEmployee(employeeData);
  //     fetchEmployees(); // cleaner refresh
  //   } catch (error) {
  //     console.error("Error adding employee:", error);
  //   }
  // };

  const handleAddEmployee = async (employeeData) => {
  try {
    console.log("SENDING DATA:", employeeData);
    await createEmployee(employeeData);
    fetchEmployees();
  } catch (error) {
    console.error("ERROR RESPONSE:", error.response?.data);
  }
};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <EmployeeForm onEmployeeAdded={handleAddEmployee} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {loading && (
          <p className="text-gray-500">Loading employees...</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <EmployeeTable employees={employees} />
        )}
      </div>
    </div>
  );
}

export default EmployeesPage;