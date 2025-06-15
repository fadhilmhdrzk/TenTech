import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function Hangtuah() {
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
        <span className="text-gray-700">RS Awal Bros Hangtuah</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600 mb-4">RS Awal Bros Hangtuah</h1>

      {/* Gambar */}
      <img src="https://awalbros.com/storage/uploads/682bea0c2f38cL8kxNZBYKAnBqtscX7y9pwyaARubgRzy34ALXZTN.jpg" alt="RS Awal Bros Hangtuah" className="w-full object-cover rounded-md"/>

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="mb-4">
          RS Awal Bros Hangtuah adalah cabang terbaru dari jaringan RS Awal Bros Group yang resmi beroperasi di Jalan Hang Tuah Ujung, Kota Pekanbaru, Riau. Rumah sakit ini 
          hadir sebagai solusi layanan kesehatan lengkap dengan fasilitas modern dan pelayanan berbasis empati, nyaman untuk semua kalangan.
        </p>
        <p className="font-semibold mt-4 mb-2">Fasilitas Rumah Sakit Modern</p>
        <p className="mb-2">RS Awal Bros Hangtuah dirancang dengan arsitektur ramah pasien dan fasilitas layanan kesehatan mutakhir, seperti:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Instalasi Gawat Darurat (IGD) 24 Jam.</li>
          <li>Klinik Spesialis & Subspesialis.</li>
          <li>Rawat Inap & Ruang Operasi Standar Internasional.</li>
          <li>Medical Check-Up Center.</li>
          <li>Instalasi Laboratorium & Radiologi Digital.</li>
          <li>Layanan MCU, Vaksinasi, hingga Rehabilitasi Medik.</li>
        </ul>
        <p className="font-semibold mt-4 mb-2">Mengapa Memilih RS Awal Bros Hangtuah?</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Akses Mudah di Pusat Kota Pekanbaru</li>
          <li>Kapasitas 337 Tempat Tidur dengan Standar Pelayanan Internasional</li>
          <li>Tenaga Medis dan Peralatan Terbaik di Setiap Pusat Layanan Unggulan</li>
          <li>Dukungan Pemeriksaan Kesehatan Preventif untuk Gaya Hidup Sehat</li>
        </ul>
        <p className="font-semibold mt-4 mb-2">Didukung Dokter Spesialis & Subspesialis</p>
        <p className="mb-4">Dengan dukungan tim medis profesional dokter spesialis dan subspesialis RS Awal Bros Group, pasien di RS Awal Bros Hangtuah akan mendapatkan pelayanan medis 
            dari berbagai disiplin ilmu, mulai dari penyakit dalam, bedah, anak, jantung, paru, hingga ortopedi dan onkologi.
        </p>
        <p className="font-semibold mt-4 mb-2">Lokasi Strategis & Akses Mudah</p>
        <p className="mb-4">Berlokasi di Jl. Hang Tuah Ujung, Pekanbaru, rumah sakit ini mudah dijangkau dari berbagai wilayah di Riau dan menjadi pilihan utama warga yang mencari 
            rumah sakit terdekat dengan pelayanan lengkap.
        </p>
      </div>
    </div>
  );
}
