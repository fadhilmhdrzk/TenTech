import React from 'react';
import { useLocation } from 'react-router-dom';

const AdminNavbar = ({ user }) => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const page = pathname.split('/').pop();
    
    switch (page) {
      case "patients":
        return "Manajemen Pasien";
      case "dashboard":
        return "Dasbor Rumah Sakit";
      case "tickets":
        return "Antrean Tiket";
      case "departments-management":
        return "Manajemen Departemen";
      case "staff-management":
        return "Manajemen Staf";
      case "appointments":
        return "Manajemen Janji Temu";
      case "doctors":
        return "Manajemen Dokter";
      case "reports":
        return "Laporan & Analitik";
      case "settings":
        return "Pengaturan";
      case "admin":
        return "Dasbor Rumah Sakit";
      default:
        return page ? page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ') : "Dasbor Rumah Sakit";
    }
  };

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <h1 className="text-xl font-semibold text-gray-700">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">

        {/* User Profile - Tetap di sini */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <span className="font-medium">{user.name}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;