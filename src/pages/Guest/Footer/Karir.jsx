import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function Karir() {
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
        <span className="text-gray-700">Karir dan Pelatihan di RS Awal Bros Group</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00afc5] mb-4">Karir dan Pelatihan di RS Awal Bros Group</h1>

      {/* Gambar */}
      <img
        src="https://awalbros.com/storage/static/images/img-vision.jpg"
        alt="Karir"
        className="w-full object-cover rounded-md"
      />

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="font-semibold text-2xl mt-4 mb-2">Karier di RS Awal Bros – Temukan Peluang Kerja Sesuai Keahlian Anda</p>
        <p className="mb-1">
            Sedang mencari lowongan kerja di rumah sakit yang profesional dan terpercaya?
        </p>
        <p className="mb-4">
          Bergabunglah bersama RS Awal Bros Group dan temukan peluang karir yang sesuai dengan keahlian dan passion Anda. Kami membuka kesempatan bagi tenaga medis, paramedis, dan 
          profesional non-medis untuk berkembang bersama di lingkungan kerja yang dinamis dan kolaboratif.
        </p>
        <p className="font-semibold text-2xl mt-4 mb-2">Mengapa Berkarir di RS Awal Bros?</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Program pelatihan & pengembangan profesional berkelanjutan</li>
          <li>Kesempatan untuk berkontribusi dalam layanan kesehatan bertaraf internasional</li>
          <li>Lingkungan kerja kolaboratif & mendukung pertumbuhan karir</li>
          <li>Tersedia di berbagai lokasi strategis: Pekanbaru, Batam, Dumai, Ujung Batu, Bagan Batu</li>
        </ul>
        <p className="font-semibold text-2xl mt-4 mb-2">Posisi yang Dibutuhkan :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Dokter umum & spesialis</li>
          <li>Perawat dan bidan</li>
          <li>Tenaga laboratorium, radiologi, dan farmasi</li>
          <li>Staff IT, keuangan, SDM, administrasi, dan lainnya</li>
        </ul>
      </div>
    </main>
  );
}
