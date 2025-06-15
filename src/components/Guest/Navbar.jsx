import { Link } from "react-router-dom";

export default function Navbar() {
    const Dropdown = ({ label, children }) => {
        return (
            <div className="relative group cursor-pointer">
                <span className="hover:text-blue-700">{label} ▾</span>
                <div className="absolute hidden group-hover:block bg-white shadow-xl shadow-black/20 border border-gray-300 rounded-md mt-2 min-w-max z-10">
                    {children}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link to="/">
                            <img
                                src="https://home.trilux.id/wp-content/uploads/2020/03/logo-polos-awal-bros.png"
                                alt="Logo Awal Bros"
                                className="h-12"
                            />
                        </Link>
                    </div>

                    {/* Menu */}
                    <nav className="flex gap-6 text-sm">
                        <Link to="/profile" className="hover:text-blue-700">Profil</Link>

                        <Dropdown label="Panduan Pasien">
                            <Link to="/Panduan/internasional" className="block px-4 py-2 hover:bg-gray-100">Layanan Pasien Internasional</Link>
                            <Link to="/Panduan/laporan" className="block px-4 py-2 hover:bg-gray-100">Permintaan Laporan Medis</Link>
                            <Link to="/Panduan/faq" className="block px-4 py-2 hover:bg-gray-100">FAQ</Link>
                        </Dropdown>

                        <Dropdown label="Layanan">
                            <Link to="/layanan/umum" className="block px-4 py-2 hover:bg-gray-100">Layanan Umum</Link>
                            <Link to="/layanan/spesialis" className="block px-4 py-2 hover:bg-gray-100">Layanan Spesialis</Link>
                        </Dropdown>

                        <Dropdown label="Rumah Sakit Kami">
                            <Link to="/RS/pekanbaru" className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap">RS Awal Bros Pekanbaru</Link>
                            <Link to="/RS/panam" className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap">RS Awal Bros Panam</Link>
                            <Link to="/RS/yani" className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap">RS Awal Bros A.Yani</Link>
                            <Link to="/RS/hangtuah" className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap">RS Awal Bros Hangtuah</Link>
                        </Dropdown>

                        <Link to="/kontak" className="hover:text-blue-700">Pendaftaran Antrian</Link>
                        <Link to="/kontak" className="hover:text-blue-700">Kontak</Link>
                    </nav>

                    {/* Search + Language */}
                    <div className="flex items-center gap-2 ">
                        <input type="text" placeholder="Cari" className="border px-2 py-1 rounded-md text-sm"/>
                        <button className="bg-teal-600 text-white px-3 py-1 rounded-md text-sm">ID ▾</button>
                    </div>
                </div>
            </header>

            {/* Banner image di bawah navbar */}
            <div className="mt-[72px] w-full">
                <img
                    src="https://awalbros.com/storage/static/images/navbar-banner.jpg"
                    alt="Banner"
                    className="w-full object-cover max-h-[300px]"
                />
            </div>
        </>
    );
}
