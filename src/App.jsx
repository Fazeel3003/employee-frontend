import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import Layout from "./layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import DepartmentPage from "./pages/DepartmentPage";
import PositionsPage from "./pages/PositionsPage";
import ProjectsPage from "./pages/ProjectsPage";
import EmployeeProjectsPage from "./pages/EmployeeProjectsPage";
import AttendancePage from "./pages/AttendancePage";
import SalaryPage from "./pages/SalaryPage";
import LeavePage from "./pages/LeavePage";
import ModalManager from "./components/ModalManager";

function App() {
  return (
    <ModalProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/department" element={<DepartmentPage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/employee-projects" element={<EmployeeProjectsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/leave" element={<LeavePage />} />
          </Routes>
        </Layout>
        <ModalManager />
      </Router>
    </ModalProvider>
  );
}

export default App;