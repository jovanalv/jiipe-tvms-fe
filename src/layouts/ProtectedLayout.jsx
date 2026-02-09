import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const ProtectedLayout = () => {
  const token = localStorage.getItem("token");

  const isLoggedIn = token ? true : false;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen overflow-hidden text-gray-900 bg-white">
      <Sidebar />
      <div className="relative flex-1 overflow-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
