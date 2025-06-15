import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function Pekanbaru() {
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
        <span className="text-gray-700">RS Awal Bros Pekanbaru</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600 mb-4">RS Awal Bros Pekanbaru</h1>

      {/* Gambar */}
      <img src="https://awalbros.com/storage/static/logo-our-hospital/rs-awal-bros-pekanbaru.jpeg" alt="RS Awal Bros Pekanbaru" className="w-full object-cover rounded-md"/>

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="mb-4">
          Berdiri sejak 29 Agustus 1998, Rumah Sakit Awal Bros Pekanbaru telah menjadi pilihan utama masyarakat Pekanbaru dan sekitarnya dalam mendapatkan layanan kesehatan berkualitas. 
          Terletak strategis di pusat kota dan hanya berjarak 10 menit dari Bandara Sultan Syarif Kasim II, RS Awal Bros Pekanbaru menawarkan akses mudah dan cepat bagi pasien dari 
          berbagai wilayah. Saat ini RS Awal Bros telah menjadi rumah sakit swasta pertama kelas A di Pulau Sumatera.
        </p>
        <p className="mb-4">
          Dengan kapasitas 337 tempat tidur, kami siap melayani berbagai kebutuhan pasien dengan mengutamakan keselamatan dan kualitas pelayanan. RS Awal Bros Pekanbaru telah 
          terakreditasi nasional dari Komisi Akreditasi Rumah Sakit (KARS) serta meraih akreditasi internasional dari Joint Commission International (JCI) sejak tahun 2014, 
          sebagai bukti standar tinggi dalam perawatan kesehatan yang kami berikan.
        </p>
        <p className="font-semibold mb-2">Mengapa Memilih RS Awal Bros Pekanbaru?</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Akses Mudah di Pusat Kota Pekanbaru</li>
          <li>Kapasitas 337 Tempat Tidur dengan Standar Pelayanan Internasional</li>
          <li>Tenaga Medis dan Peralatan Terbaik di Setiap Pusat Layanan Unggulan</li>
          <li>Dukungan Pemeriksaan Kesehatan Preventif untuk Gaya Hidup Sehat</li>
        </ul>
      </div>
    </div>
  );
}
