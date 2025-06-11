import { Routes, Route, Link } from 'react-router-dom';
import AdminPage from './pages/Admin/AdminPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLayout from './layouts/Admin/AdminLayout';
import { useState } from 'react';

function App() {
  return (
    <div className="p-4">
      {/* Navigation Bar */}
      <nav className="mb-6 flex gap-4 bg-blue-100 p-4 rounded-lg">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Home
        </Link>
        <Link to="/admin" className="text-blue-600 hover:text-blue-800">
          Admin Dashboard
        </Link>
      </nav>

      {/* All Routes including Admin */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="page" element={<AdminPage />} />
        </Route>
      </Routes>
    </div>
  );
}

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

export default App;
