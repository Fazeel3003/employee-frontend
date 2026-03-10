import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-gray-700";

  const activeClass =
    "bg-gray-800 text-white";

  return (
    <div className="w-60 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">EMS</h2>

      <nav className="flex flex-col gap-2">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Employees
        </NavLink>

        <NavLink
          to="/department"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Departments
        </NavLink>

        <NavLink
          to="/positions"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Positions
        </NavLink>

         <NavLink
          to="/projects"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/employee-projects"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Employee Projects
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Attendance
        </NavLink>

        <NavLink
          to="/salary"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Salary History
        </NavLink>

        <NavLink
          to="/leave"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Leave Requests
        </NavLink>

      </nav>
    </div>
  );
}

export default Sidebar;