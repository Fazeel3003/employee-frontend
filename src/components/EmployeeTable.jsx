function EmployeeTable({ employees }) {
  return (
    <table border="1" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Hire Date</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.emp_id}>
            <td>{emp.emp_id}</td>
            <td>{emp.first_name}</td>
            <td>{emp.last_name}</td>
            <td>{emp.email}</td>
            <td>{emp.hire_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default EmployeeTable
