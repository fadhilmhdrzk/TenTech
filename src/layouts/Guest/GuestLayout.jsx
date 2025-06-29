import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Guest/Navbar";
import Footer from "../../components/Guest/Footer";
import Daftar from "../../components/Guest/Daftar";

export default function GuestLayout() {
  const location = useLocation();

  // Path yang ingin disembunyikan <Daftar />
  const hiddenPaths = ["/guest"];
  const hideDaftar = hiddenPaths.includes(location.pathname);

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
        {!hideDaftar && <Daftar />}
      </main>
      <Footer />
    </div>
  );
}
