import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Hapus 'BrowserRouter as Router' dari sini
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './supabaseClient';

// --- Layouts (Import Statis) ---
import AdminLayout from './layouts/Admin/AdminLayout';
import GuestLayout from './layouts/Guest/GuestLayout';
import Kontak from './pages/Guest/Kontak';
// --- Admin Pages (Import Statis) ---
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminPage from './pages/Admin/AdminPage';
import Tickets from './pages/Admin/Tickets';
import DepartmentManagement from './components/Admin/DepartmentManagement';
import StaffManagement from './components/Admin/StaffManagement';

// --- Guest Pages (Import Statis) ---
import Home from './pages/Guest/Home';
import Guest from './pages/Guest/guest';
import Profile from './pages/Guest/Profile';
import Pekanbaru from './pages/Guest/RS/Pekanbaru';
import Panam from './pages/Guest/RS/Panam';
import Yani from './pages/Guest/RS/Yani';
import Hangtuah from './pages/Guest/RS/Hangtuah';
import Internasional from './pages/Guest/Panduan/Internasional';
import Laporan from './pages/Guest/Panduan/Laporan';
import FAQ from './pages/Guest/Panduan/FAQ';

// --- Auth Pages (Import Statis) ---
import Login from './pages/Auth/login';
import Register from './pages/Auth/Register';
import Forgot from './pages/Auth/Forgot';


// --- Komponen Loading (Import Statis) ---
import Loading from "./components/Loading";


// Komponen Pembungkus untuk Rute Terlindungi (Diaktifkan kembali untuk Peran Staf)
const RequireAuth = ({ children, requiredRole = null }) => {
  const { user, staffProfile, loading } = useAuth(); // Ambil staffProfile

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Jika tidak ada user yang login sama sekali, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  // --- LOGIKA PERLINDUNGAN AKSES ADMIN BERDASARKAN PERAN STAF ---
  if (requiredRole === 'admin_access') {
    const allowedAdminRoles = ['admin', 'doctor', 'receptionist', 'nurse'];

    const hasAdminAccess = staffProfile && allowedAdminRoles.includes(staffProfile.role);

    if (!hasAdminAccess) {
      // Jika user bukan staf atau staf tapi perannya tidak diizinkan untuk admin,
      // alihkan ke halaman home atau tampilkan pesan akses ditolak
      console.warn("Akses ditolak: Pengguna bukan staf atau tidak memiliki peran admin yang diizinkan.");
      // Anda bisa mengganti ini dengan rute ke halaman "Akses Ditolak" jika Anda membuatnya
      return <Navigate to="/" replace />; // Alihkan ke halaman utama
    }
  }

  return children;
};


function App() {
  return (
    // Pastikan tidak ada tag <Router> di sini. Router sudah ada di main.jsx.
    <div className="min-h-screen bg-white p-4">
      <Suspense fallback={<Loading />}>
        <AuthProvider>
          <Routes>
            {/* Rute Autentikasi (Tidak dilindungi) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />

            {/* Rute Admin (Dilindungi oleh RequireAuth dengan peran 'admin_access') */}
            <Route path="/admin" element={<RequireAuth requiredRole="admin_access"><AdminLayout /></RequireAuth>}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="patients" element={<AdminPage />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="add-department" element={<DepartmentManagement />} />
              <Route path="add-staff" element={<StaffManagement />} />
              {/* Rute Placeholder sudah dihapus */}
            </Route>

            {/* Rute Guest (Tamu) */}
            <Route element={<GuestLayout />}>
              <Route path="/" element={<Home />} />
              {/* Rute Profil Pengguna (Pasien) dilindungi */}
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                <Route path="/Kontak" element={<Kontak/>} />
              
              {/* Rute Formulir Tiket (Dilindungi untuk pengguna yang login) */}
              <Route path="/guest" element={<RequireAuth><Guest /></RequireAuth>} />

              {/* Rute Rumah Sakit dan Panduan (Tidak dilindungi, akses publik) */}
              <Route path="/rs/pekanbaru" element={<Pekanbaru />} />
              <Route path="/rs/panam" element={<Panam />} />
              <Route path="/rs/yani" element={<Yani />} />
              <Route path="/rs/hangtuah" element={<Hangtuah />} />
              <Route path="/Panduan/internasional" element={<Internasional />} />
              <Route path="/Panduan/Laporan" element={<Laporan />} />
              <Route path="/Panduan/faq" element={<FAQ />} />
            </Route>

            {/* Rute catch-all untuk halaman tidak ditemukan */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Suspense>
    </div>
    // Pastikan tidak ada tag </Router> di sini
  );
}

export default App;

// Definisi komponen placeholder sudah dihapus dari file ini.