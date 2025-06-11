// App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import AdminPage from './components/Admin/AdminPage';
import { useState } from 'react';
import GuestLayout from './layouts/Guest/GuestLayout';
import Home from './pages/Guest/Home';
import Profile from './pages/Guest/Profile';

function App() {
  return (
    <div className="p-4">

      {/* Routes */}
      <Routes>
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/profile" element={<Profile/>} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
