import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminNavbar from "../../components/Admin/AdminNavbar";

const AdminLayout = () => {
  const [user] = useState({ name: "Manpreet Singh", role: "Administrator" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-20 min-h-screen">
        {/* Top Navigation Bar */}
        <AdminNavbar user={user} />

        {/* Page Content - This is where nested routes will render */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;