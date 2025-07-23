import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      path: '/admin/dashboard',
      label: 'Dasbor'
    },
    {
      id: 'patients',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/admin/patients',
      label: 'Manajemen Pasien'
    },
    {
      id: 'tickets',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M12 2a3 3 0 00-3 3v12a3 3 0 003 3h5a3 3 0 003-3V5a3 3 0 00-3-3H12zM7 7H4a2 2 0 00-2 2v10a2 2 0 002 2h5" />
        </svg>
      ),
      path: '/admin/tickets',
      label: 'Antrean Tiket'
    },
    {
      id: 'departments-management',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 20h6M9 8h6m-9 4h6m-6 4h6m-6-8h0.01M17 12h.01M17 16h.01" />
        </svg>
      ),
      path: '/admin/add-department',
      label: 'Manajemen Departemen'
    },
    {
      id: 'staff-management',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.385A63.484 63.484 0 0012 21c2.755 0 5.484-.672 7.009-2.915S21 14.517 21 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4c0 3.517 1.009 6.799 2.753 9.385A63.484 63.484 0 0012 21c2.755 0 5.484-.672 7.009-2.915S21 14.517 21 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4zM12 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: '/admin/add-staff',
      label: 'Manajemen Staf'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Jika pakai auth, tambahkan logika hapus token/session di sini
    // localStorage.removeItem('token'); // jika pakai token
    navigate('/'); // Arahkan ke halaman guest
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-blue-600 to-blue-800 shadow-lg z-50 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center py-6">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col space-y-2 px-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`group relative w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-white text-blue-600 shadow-lg'
                : 'text-white hover:bg-white/20 hover:scale-105'
            }`}
            title={item.label}
          >
            {item.icon}

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section - Logout */}
      <div className="p-3 border-t border-white/20">
        <div
          onClick={handleLogout}
          className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors group"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>

          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Keluar
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
