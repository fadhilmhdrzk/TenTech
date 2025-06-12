import React from 'react';
import { useLocation } from 'react-router-dom';

const AdminNavbar = ({ user }) => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    // Extract the page from the pathname
    const page = pathname.split('/').pop();
    
    switch (page) {
      case "patients":
        return "Patient Data Entry";
      case "dashboard":
        return "Hospital Dashboard";
      case "appointments":
        return "Appointments Management";
      case "doctors":
        return "Doctor Management";
      case "reports":
        return "Reports & Analytics";
      case "settings":
        return "Settings";
      case "admin":
        return "Hospital Dashboard"; // For the index route
      default:
        return page ? page.charAt(0).toUpperCase() + page.slice(1) : "Dashboard";
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
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-2 border border-gray-300 rounded-md w-64 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Assigned to</option>
        </select>

        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Location</option>
        </select>

        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>By Date</option>
        </select>

        {/* User Profile */}
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