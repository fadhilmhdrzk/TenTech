import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "./components/Admin/AdminPage";
import GuestLayout from "./layouts/Guest/GuestLayout";
import Home from "./pages/Guest/Home";
import Profile from "./pages/Guest/Profile";
import Pekanbaru from "./pages/Guest/RS/pekanbaru";
import Panam from "./pages/Guest/RS/panam";
import Yani from "./pages/Guest/RS/Yani";
import Hangtuah from "./pages/Guest/RS/hangtuah";
import Internasional from "./pages/Guest/Panduan/Internasional";
import Laporan from "./pages/Guest/Panduan/Laporan";
import FAQ from "./pages/Guest/Panduan/FAQ";

const Loading = React.lazy(() => import("./components/Loading"));

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />

          <Route element={<GuestLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rs/pekanbaru" element={<Pekanbaru />} />
            <Route path="/rs/panam" element={<Panam />} />
            <Route path="/rs/yani" element={<Yani />} />
            <Route path="/rs/hangtuah" element={<Hangtuah />} />
            <Route path="/Panduan/internasional" element={<Internasional />} />
            <Route path="/Panduan/Laporan" element={<Laporan />} />
            <Route path="/Panduan/faq" element={<FAQ />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
