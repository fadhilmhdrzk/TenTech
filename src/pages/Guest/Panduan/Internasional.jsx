import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function Internasional() {
  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center space-x-1 mb-2">
        <Link
          to="/"
          className="text-gray-500 hover:text-teal-600 transition-colors duration-200 flex items-center gap-1"
        >
          <span><AiFillHome /></span>
          <span>Home</span>
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Layanan Pasien Internasional di RS Awal Bros</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600 mb-4">Layanan Pasien Internasional di RS Awal Bros</h1>

      {/* Gambar */}
      <img src="https://awalbros.com/storage/uploads/681db4f6e5f80uJHUBEj62whATDtv8R6HIDU6ZwZCX4i7O5wFc012.jpg" alt="Layanan Internasional" className="w-full object-cover rounded-md"/>

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="font-semibold mt-4 mb-2">Sedang mencari layanan medis terbaik di Indonesia?</p>
        <p className="mb-4">
            RS Awal Bros menyediakan dukungan khusus untuk pasien internasional, memastikan proses pengobatan berjalan nyaman dan lancar, mulai dari perencanaan kunjungan hingga 
            pemulihan pasca rawat inap. Dengan lokasi strategis di Pekanbaru, Batam, Dumai, Ujung Batu, dan Bagan Batu, kami menjadi pilihan utama pasien dari negara tetangga seperti 
            Malaysia, Singapura, India dan Timur Tengah.
        </p>
        <hr className="border-t border-gray-300 my-6" />
        <h2 className="text-xl font-bold text-gray-1000 mb-5">Layanan Kami untuk Pasien Internasional :</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Koordinasi jadwal dengan dokter spesialis terbaik sesuai kebutuhan</li>
          <li>Pendampingan multibahasa (Bahasa Inggris dll.)</li>
          <li>Layanan penjemputan bandara (airport pick-up) sesuai permintaan</li>
          <li>Penerjemahan laporan medis dan komunikasi dengan rumah sakit asal</li>
          <li>Paket perawatan khusus & second opinion dari dokter ahli</li>
          <li>Rencana tindak lanjut pasca rawat inap</li>
        </ul>
        <hr className="border-t border-gray-300 my-6" />
        <h2 className="text-xl font-bold text-gray-1000 mb-5">Mengapa Memilih RS Awal Bros?</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Rumah sakit tersertifikasi JCI dan ISO</li>
          <li>Pengalaman lebih dari 20 tahun melayani pasien internasional</li>
          <li>Teknologi medis modern & layanan diagnostik lengkap</li>
          <li>Tim khusus International Patient Services siap membantu 24 jam</li>
        </ul>
        <hr className="border-t border-gray-300 my-6" />
        <h2 className="text-xl font-bold text-gray-1000 mb-3">Hubungi Tim Layanan Pasien Internasional :</h2>
        <p className="mb-4">
        <span className="mr-2">Kunjungi:</span>
            <Link to="/" className="hover:text-teal-600 transition-colors duration-200 inline" style={{ color: "#a20000" }}>www.awalbros.com</Link>
        </p>
        <p>Call Center Indonesia: 15000 88</p>
      </div>
    </div>
  );
}
