import { useState } from "react"
import EmployeeTable from "../components/EmployeeTable"

function EmployeesPage() {
  const [employees] = useState([
    {
      emp_id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      hire_date: "2022-01-10"
    },
    {
      emp_id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      hire_date: "2023-03-15"
    }
  ])

  return (
    <div>
      <h2>Employees</h2>
      <EmployeeTable employees={employees} />
    </div>
  )
}

export default EmployeesPage
