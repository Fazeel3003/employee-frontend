import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import { LogOut } from "lucide-react";

function Sidebar() {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-gray-700";

  const activeClass =
    "bg-gray-800 text-white";

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  console.log("Sidebar rendered, user:", user);
  console.log("Sidebar user role:", user?.role);

  const menuItems = [
    { label: "Dashboard", to: "/", allowedRoles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.USER] },
    { label: "Employees", to: "/employees", allowedRoles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER] },
    { label: "Departments", to: "/department", allowedRoles: [ROLES.ADMIN, ROLES.HR] },
    { label: "Positions", to: "/positions", allowedRoles: [ROLES.ADMIN, ROLES.HR] },
    { label: "Projects", to: "/projects", allowedRoles: [ROLES.ADMIN, ROLES.MANAGER] },
    { label: "Employee Projects", to: "/employee-projects", allowedRoles: [ROLES.ADMIN, ROLES.MANAGER] },
    { label: "Attendance", to: "/attendance", allowedRoles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.USER] },
    { label: "Salary History", to: "/salary", allowedRoles: [ROLES.ADMIN, ROLES.HR, ROLES.USER] },
    { label: "Leave Requests", to: "/leave", allowedRoles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.USER] },
    { label: "Reports", to: "/reports", allowedRoles: [ROLES.ADMIN] }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user?.role && item.allowedRoles.includes(user.role)
  );

  return (
    <div className="w-60 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">EMS</h2>

      <nav className="flex flex-col gap-2 flex-1">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 text-left"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;