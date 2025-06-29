import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function Doctor() {
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
        <span className="text-gray-700">Our Doctors</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00afc5] mb-4">Our Doctors</h1>

      {/* Gambar */}
      <img
        src="https://awalbros.com/storage/uploads/6826b60d8cfd8YPGRsWRgyK2M9ZLawROs7ovkw5YdyFWElIfsgC6F.jpg"
        alt="Dokter"
        className="w-full object-cover rounded-md"
      />

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="font-semibold text-2xl mt-4 mb-2">Temukan Dokter Terbaik di RS Awal Bros – Spesialis & Subspesialis Lengkap</p>
        <p className="mb-4">
          Sedang mencari dokter spesialis terbaik di Pekanbaru, Batam, Dumai, Ujung Batu, atau Bagan Batu?
          RS Awal Bros Group hadir dengan 450+ Dokter Spesialis dan 150+ Dokter Subspesialis yang berpengalaman dan siap memberikan layanan medis berkualitas tinggi untuk Anda dan keluarga.
        </p>
        <p className="mb-4">
          Tim medis kami terdiri dari dokter spesialis penyakit dalam, bedah, anak, kandungan, jantung, saraf, paru, kulit, ortopedi, hingga subspesialis seperti onkologi, gastroenterohepatologi, endokrin, dan lainnya. 
          Semua dokter kami mengutamakan pendekatan holistik, humanis, dan berbasis empati.
        </p>

        <p className="font-semibold text-2xl mt-4 mb-2">Cari Jadwal Dokter & Konsultasi Mudah</p>
        <p className="mb-4">Anda Bisa:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Menemukan dokter sesuai spesialisasi atau lokasi rumah sakit</li>
          <li>Booking langsung melalui website atau aplikasi</li>
        </ul>
        <p className="mb-1 mt-5">Unduh sekarang di Google Play dan App Store</p>
        <p className="mb-1">Atau hubungi Call Center 1500088 kalau masih bingung</p>
        <p className="mb-4">Karena hidup sehat tuh harusnya praktis.</p>
      </div>
    </main>
  );
}
