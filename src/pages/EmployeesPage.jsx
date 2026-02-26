import { useEffect, useState } from "react"
import EmployeeTable from "../components/EmployeeTable"
import { getEmployees } from "../api/employeeService"

function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

 useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      console.log("API RESPONSE:", response);  // keep temporarily
      setEmployees(response.data);             // ✅ correct
    } catch (err) {
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  fetchEmployees();
}, []);


  if (loading) return <p>Loading employees...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>Employees</h2>
      <EmployeeTable employees={employees} />
    </div>
  )
}

export default EmployeesPage
