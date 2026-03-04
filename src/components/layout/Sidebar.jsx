import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-8">EMS</h2>

      <nav className="space-y-4">
        <Link to="/" className="block hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/employees" className="block hover:text-blue-400">
          Employees
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;