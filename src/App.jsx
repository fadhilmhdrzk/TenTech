import { Routes, Route, Link } from 'react-router-dom'; // Keep Link as it's useful for navigation
import { useState } from 'react'; // Keep useState

// --- Import from HEAD (Admin/Guest related) ---
// Correct path for AdminPage - assuming the one in 'pages' is the main one
import AdminPage from './pages/Admin/AdminPage'; // Or components/Admin/AdminPage - verify the correct path!
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLayout from './layouts/Admin/AdminLayout';
import Tickets from './pages/Admin/Tickets';
import DepartmentForm from './components/Admin/DepartmentForm';
import StaffAccountForm from './components/Admin/StaffAccountForm';
import Guest from './pages/Guest/guest'; // Ensure this is the correct Guest page import

// --- Import from e886d8a47d6318f8e34b0dd7cb008d05d3b6f1c7 (Auth/Guest related) ---
import GuestLayout from './layouts/Guest/GuestLayout';
import Home from './pages/Guest/Home';
import Profile from './pages/Guest/Profile';

import Login from './pages/Auth/login';
import Register from './pages/Auth/Register';
import Forgot from './pages/Auth/Forgot';

function App() {
  return (
    <div className="p-4">
      {/* Combined Routes */}
      <Routes>
        {/* Admin Routes (from HEAD) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<AdminPage />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="add-department" element={<DepartmentForm />} />
          <Route path="add-staff" element={<StaffAccountForm />} />
          {/* Keep placeholders if they are still relevant for future development */}
          {/* <Route path="appointments" element={<AppointmentsPagePlaceholder />} />
          <Route path="doctors" element={<DoctorManagementPagePlaceholder />} />
          <Route path="reports" element={<ReportsPagePlaceholder />} />
          <Route path="settings" element={<SettingsPagePlaceholder />} /> */}
        </Route>

        {/* Guest Routes (Combined from both) */}
        {/*
            If '/guest' is meant to be a specific page and the GuestLayout contains the main guest section,
            you need to decide which takes precedence or how they should coexist.
            Let's assume the GuestLayout wraps the main guest experience.
        */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} /> {/* This is the main Guest homepage */}
          <Route path="/profile" element={<Profile />} />
          {/* If the '/guest' route from HEAD is for a *different* page than Home, add it here.
              If 'Home' is the main guest page, you might remove the separate '/guest' route or rename it.
              For now, let's keep it if it's distinct.
          */}
          <Route path="/guest" element={<Guest />} />
        </Route>

        {/* Auth Routes (from e886d8a47d6318f8e34b0dd7cb008d05d3b6f1c7) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* The HomePage from HEAD. If Home (from guest branch) is your main landing page,
            you might remove HomePage or integrate its content into Home.
            For now, let's assume 'Home' is the primary root. If HomePage is different and needed elsewhere,
            consider giving it a distinct path, e.g., '/old-home'.
            If it's just a simple counter, it's likely replaced by the Guest 'Home' page.
            If `Home` (from guest branch) is the intended main page for `/`, then `HomePage` is probably redundant here.
            You should decide if `HomePage` is still needed. For this example, let's assume `Home` (from guest branch)
            is the primary root. So, we might remove `<Route path="/" element={<HomePage />} />`
        */}
        {/* <Route path="/" element={<HomePage />} />  <-- DECIDE: Is this needed if / is handled by <Home /> */}

      </Routes>
    </div>
  );
}

// --- Components from HEAD (if still needed) ---
// Only keep HomePage if it serves a distinct purpose from the Guest's Home component.
// If HomePage is just a simple counter or placeholder, you might remove it if Guest's Home is more developed.
function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Welcome to the Homepage</h1>
        <button onClick={() => setCount(count + 1)}>
          Count is {count}
        </button>
      </div>
    </>
  );
}

// Keep these placeholder components if they are genuinely intended for future development
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