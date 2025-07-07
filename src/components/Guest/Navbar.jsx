import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

export default function Navbar() {
  const { user, staffProfile } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const isAdmin = staffProfile?.role === "admin"; // ← Cek peran admin

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // ⬅️ Arahkan ke dashboard
  };

  const Dropdown = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const toggleDropdown = () => {
      setIsOpen((prev) => !prev);
    };

    return (
      <div className="relative cursor-pointer" ref={dropdownRef}>
        <span onClick={toggleDropdown} className="hover:text-blue-700 flex items-center">
          {label}
          <span
            className="ml-1 text-xs"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▾
          </span>
        </span>
        {isOpen && (
          <div className="absolute bg-white shadow-xl shadow-black/20 border border-gray-300 rounded-md mt-2 min-w-max z-10">
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    onClick: () => {
                      setIsOpen(false);
                      if (child.props.onClick) child.props.onClick();
                    },
                    className: `block px-4 py-2 hover:bg-gray-100 ${child.props.className || ""}`,
                  })
                : child
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img
                src="https://home.trilux.id/wp-content/uploads/2020/03/logo-polos-awal-bros.png"
                alt="Logo Awal Bros"
                className="h-12"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/48x48/CCCCCC/333333?text=Logo";
                }}
              />
            </Link>
          </div>

          <nav className="flex gap-6 text-sm">
            <Link to="/profile" className="hover:text-blue-700">Profil</Link>

            <Dropdown label="Panduan Pasien">
              <Link to="/Panduan/internasional">Layanan Pasien Internasional</Link>
              <Link to="/Panduan/laporan">Permintaan Laporan Medis</Link>
              <Link to="/Panduan/faq">FAQ</Link>
            </Dropdown>

            <Dropdown label="Rumah Sakit Kami">
              <Link to="/RS/pekanbaru" className="whitespace-nowrap">RS Awal Bros Pekanbaru</Link>
              <Link to="/RS/panam" className="whitespace-nowrap">RS Awal Bros Panam</Link>
              <Link to="/RS/yani" className="whitespace-nowrap">RS Awal Bros A.Yani</Link>
              <Link to="/RS/hangtuah" className="whitespace-nowrap">RS Awal Bros Hangtuah</Link>
            </Dropdown>

            <Link to="/guest" className="hover:text-blue-700">Pendaftaran Antrian</Link>
            <Link to="/kontak" className="hover:text-blue-700">Kontak</Link>

            {/* 🔐 Link Admin Hanya Muncul Jika Admin Login */}
            {isLoggedIn && isAdmin && (
              <Link to="/admin" className="hover:text-blue-700 font-semibold">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-teal-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mt-[72px] w-full">
        <img
          src="https://awalbros.com/storage/static/images/navbar-banner.jpg"
          alt="Banner"
          className="w-full object-cover max-h-[300px]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/1200x300/CCCCCC/333333?text=Banner+Image";
          }}
        />
      </div>
    </>
  );
}
