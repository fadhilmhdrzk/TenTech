import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { useEffect } from "react";

export default function Awards() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="px-4 py-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center space-x-1 mb-2">
        <Link
          to="/"
          className="text-gray-500 hover:text-[#00afc5] transition-colors duration-200 flex items-center gap-1"
        >
          <AiFillHome />
          <span>Home</span>
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Awards and Achievements</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00afc5] mb-4">Awards and Achievements</h1>

      {/* Gambar */}
      <img
        src="https://rsusaifulanwar.jatimprov.go.id/wp-content/uploads/2025/04/Untitled3.jpg"
        alt="Penghargaan"
        className="w-full object-cover rounded-md"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/600x300?text=Image+Not+Found";
        }}
      />

      {/* Deskripsi */}
      <ul className="list-disc pl-5 space-y-3 mt-10 text-gray-800">
        <li>Penghargaan dari BPJS atas "Integrasi Sistem Antrian Online, Integrasi sistem Klaim, Implementasi E-SEP dan Finger Print" untuk RS Awal Bros Botania</li>
        <li>RS Awal Bros Panam sebagai rumah sakit rujukan penanganan krisis kesehatan di Provinsi Riau</li>
        <li>Penghargaan Tertib Administrasi Kepesertaan Terbaik di Pekanbaru</li>
        <li>Penghargaan BIDDOKES Polda Riau</li>
        <li>Penghargaan Marketing Champion Riau Kepri 2024</li>
        <li>Tribun Digital Award</li>
      </ul>
    </main>
  );
}
