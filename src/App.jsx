import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import AdminPage from './components/Admin/AdminPage';
import GuestLayout from './layouts/Guest/GuestLayout';
import Home from './pages/Guest/Home';
import Profile from './pages/Guest/Profile';

import Login from './pages/Auth/login';
import Register from './pages/Auth/Register';
import Forgot from './pages/Auth/Forgot';

function App() {
  return (
    <div className="p-4">
      {/* Routes */}
      <Routes>
        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Guest */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
      </Routes>
    </div>
  );
}

export default App;
