import { Link } from "react-router-dom";

export default function Daftar() {
  return (
    <div className="bg-[#00afc5] text-white text-center py-16 px-4">
      <h3 className="text-lg font-semibold mb-2">Pusat Janji Temu</h3>
      <h1 className="text-4xl font-bold mb-4">RS Awal Bros</h1>
      <p className="mb-1">Jam Operasional Layanan Telepon 06:00 - 22:00 WIB</p>
      <p className="mb-1">Layanan Booking Mandiri Bisa Kapanpun dan Dari</p>
      <p className="mb-6">Manapun via Website dan Aplikasi</p>
      <Link to="/guest" className="inline-block bg-white text-cyan-500 font-semibold px-9 py-2 rounded-full hover:bg-gray-300 transition">Daftar Sekarang</Link>
    </div>
  );
}
