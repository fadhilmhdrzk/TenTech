import React, { Suspense, useState } from "react"; // Combined React, Suspense, useState
import { Routes, Route, Link } from "react-router-dom"; // Keep Link

// --- Admin Imports (from current master) ---
import AdminPage from './pages/Admin/AdminPage'; // Assuming this is the correct AdminPage path
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLayout from './layouts/Admin/AdminLayout';
import Tickets from './pages/Admin/Tickets';
import DepartmentForm from './components/Admin/DepartmentForm';
import StaffAccountForm from './components/Admin/StaffAccountForm';

// --- Guest Imports (Combined from both) ---
// Note: Guest and Home might be slightly redundant depending on their content.
// Assuming 'Home' is the primary guest landing page.
import Guest from './pages/Guest/guest'; // Keep if it's a distinct page, otherwise remove
import GuestLayout from './layouts/Guest/GuestLayout';
import Home from './pages/Guest/Home';
import Profile from './pages/Guest/Profile';
// New Guest RS pages
import Pekanbaru from "./pages/Guest/RS/Pekanbaru";
import Panam from "./pages/Guest/RS/Panamanam";
import Yani from "./pages/Guest/RS/Yani";
import Hangtuah from "./pages/Guest/RS/Hangtuahangtuah";
// New Guest Panduan pages
import Internasional from "./pages/Guest/Panduan/Internasional";
import Laporan from "./pages/Guest/Panduan/Laporan";
import FAQ from "./pages/Guest/Panduan/FAQ";

// --- Auth Imports (from current master) ---
import Login from './pages/Auth/login';
import Register from './pages/Auth/Register';
import Forgot from './pages/Auth/Forgot';

// Lazy loading component (from guest branch)
const Loading = React.lazy(() => import("./components/Loading"));

function App() {
  return (
    <div className="min-h-screen bg-white p-4"> {/* Combined styling and p-4 */}
      <Suspense fallback={<Loading />}> {/* Added Suspense from guest branch */}
        <Routes>
          {/* Admin Routes (from master) */}
          {/* We use the more detailed AdminLayout route from master, overriding the simpler /admin from guest branch */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<AdminPage />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="add-department" element={<DepartmentForm />} />
            <Route path="add-staff" element={<StaffAccountForm />} />
            {/* Keep these placeholders if genuinely planned */}
            {/* <Route path="appointments" element={<AppointmentsPagePlaceholder />} />
            <Route path="doctors" element={<DoctorManagementPagePlaceholder />} />
            <Route path="reports" element={<ReportsPagePlaceholder />} />
            <Route path="settings" element={<SettingsPagePlaceholder />} /> */}
          </Route>

          {/* Guest Routes (Combined from both master and guest branch) */}
          <Route element={<GuestLayout />}>
            <Route path="/" element={<Home />} /> {/* Guest's Home is the main homepage */}
            <Route path="/profile" element={<Profile />} />
            {/* Keep /guest only if it's a distinct page from / */}
            <Route path="/guest" element={<Guest />} />

            {/* New Hospital Routes from guest branch */}
            <Route path="/rs/pekanbaru" element={<Pekanbaru />} />
            <Route path="/rs/panam" element={<Panam />} />
            <Route path="/rs/yani" element={<Yani />} />
            <Route path="/rs/hangtuah" element={<Hangtuah />} />

            {/* New Panduan Routes from guest branch */}
            <Route path="/Panduan/internasional" element={<Internasional />} />
            <Route path="/Panduan/Laporan" element={<Laporan />} />
            <Route path="/Panduan/faq" element={<FAQ />} />
          </Route>

          {/* Auth Routes (from master) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />

          {/* Removed: <Route path="/" element={<HomePage />} /> from master
              because Guest's Home component is now handling the root path.
          */}
        </Routes>
      </Suspense>
    </div>
  );
}

// --- Components (from master, removed HomePage as Guest's Home is primary) ---
// Only keep placeholder components if they are genuinely intended for future development
// Removed HomePage function as Home component from Guest branch is now at '/'
const AppointmentsPagePlaceholder = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Appointments Management
      </h2>
      <p className="text-gray-600">
        This page will contain appointment scheduling and management features.
      </p>
    </div>
  </div>
);

const DoctorManagementPagePlaceholder = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Doctor Management
      </h2>
      <p className="text-gray-600">
        This page will contain doctor profiles, schedules, and management
        features.
      </p>
    </div>
  </div>
);

const ReportsPagePlaceholder = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Reports & Analytics
      </h2>
      <p className="text-gray-600">
        This page will contain hospital analytics, charts, and reporting
        features.
      </p>
    </div>
  </div>
);

const SettingsPagePlaceholder = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
      <p className="text-gray-600">
        This page will contain system settings and configuration options.
      </p>
    </div>
  </div>
);

export default App;