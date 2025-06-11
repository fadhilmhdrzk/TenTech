import { BiCartAlt, BiSearch } from "react-icons/bi";
import { MdOutlineFastfood } from "react-icons/md";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {

    const Dropdown = ({ label }) => {
        return (
            <div className="relative group cursor-pointer">
                <span className="hover:text-blue-700">{label} ▾</span>
                {/* Dropdown content - tambahkan sesuai kebutuhan */}
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 min-w-[150px] z-10">
                    <Link to="#" className="block px-4 py-2 hover:bg-gray-100">Submenu 1</Link>
                    <Link to="#" className="block px-4 py-2 hover:bg-gray-100">Submenu 2</Link>
                </div>
            </div>
        );
    };
    const menuClass = ({ isActive }) =>
        `relative px-4 py-2 rounded-md transition-all ${isActive
            ? "text-merah font-extrabold border-t-4 border-red-500"
            : "text-gray-600 hover:text-merah hover:bg-merah-200 hover:font-extrabold"
        }`;

    return (
        <header className="bg-white shadow-md">
            <div className="w-full flex items-center justify-between px-4 py-2">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src="https://home.trilux.id/wp-content/uploads/2020/03/logo-polos-awal-bros.png" alt="Logo Awal Bros" className="h-13" />
                </div>

                {/* Menu */}
                <nav className="flex gap-6 text-sm">
                    <Link to="/profile" className="hover:text-blue-700">Profil</Link>
                    <Dropdown label="Panduan Pasien" />
                    <Dropdown label="Layanan" />
                    <Dropdown label="Rumah Sakit Kami" />
                    <Link to="kontak" className="hover:text-blue-700">Kontak</Link>
                </nav>

                {/* Search + Language */}
                <div className="flex items-center gap-2">
                    <input type="text" placeholder="Cari" className="border px-2 py-1 rounded-md text-sm" />
                    <button className="bg-blue-900 text-white px-3 py-1 rounded-md text-sm">ID ▾</button>
                </div>
            </div>
        </header>
    );
}