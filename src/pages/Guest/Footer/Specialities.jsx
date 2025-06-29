import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import React, { useEffect } from "react";


export default function Specialities() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center space-x-1 mb-2">
        <Link
          to="/"
          className="text-gray-500 hover:text-[#00afc5] transition-colors duration-200 flex items-center gap-1"
        >
          <span><AiFillHome /></span>
          <span>Home</span>
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Our Specialities</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00afc5] mb-4">Our Specialities</h1>

      {/* Gambar */}
      <img src="https://awalbros.com/storage/uploads/6826b60d8cfd8YPGRsWRgyK2M9ZLawROs7ovkw5YdyFWElIfsgC6F.jpg" alt="Spesialities" className="w-full object-cover rounded-md"/>

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="text-[#00afc5] font-semibold text-2xl mt-4 mb-2">Layanan Unggulan RS Awal Bros: Menghadirkan Standar Internasional untuk Kesehatan Anda</p>
        <p className="mb-4">Sebagai jaringan rumah sakit swasta yang telah melayani masyarakat Indonesia selama lebih dari dua dekade, RS Awal Bros hadir dengan komitmen tinggi untuk 
            memberikan pelayanan kesehatan berkualitas internasional, berfokus pada keselamatan pasien, kenyamanan layanan, dan inovasi medis berkelanjutan.
        </p>
        <p className="mb-4">Kami menghadirkan berbagai layanan spesialistik dan pusat layanan unggulan (center of excellence) yang ditangani oleh tim dokter spesialis dan subspesialis 
            berpengalaman, dengan dukungan teknologi medis modern. Beberapa layanan unggulan kami meliputi :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li className="text-black font-semibold mb-1">Pusat Jantung dan Pembuluh Darah</li>
          <p>Diagnosis dan penanganan penyakit jantung terpadu, termasuk kateterisasi, angiografi, dan rehabilitasi jantung.</p>
          <li className="text-black font-semibold mt-4 mb-1">Layanan Onkologi dan Kemoterapi</li>
          <p>Penanganan kanker secara multidisiplin, termasuk radioterapi, kemoterapi, dan layanan paliatif yang terintegrasi.</p>
          <li className="text-black font-semibold mt-4  mb-1">Pusat Layanan Ibu dan Anak</li>
          <p>Mulai dari kehamilan risiko tinggi, persalinan aman, NICU, hingga tumbuh kembang anak.</p>
          <li className="text-black font-semibold mt-4  mb-1">Fertility Center (Program Bayi Tabung/IVF)</li>
          <p>Klinik Tunas Bangsa sebagai pusat fertilitas terpercaya dengan pendekatan etis, aman, dan penuh harapan bagi pasangan yang mendambakan buah hati.</p>
          <li className="text-black font-semibold mt-4  mb-1">Pusat Layanan Saraf dan Stroke</li>
          <p>Deteksi dini, penanganan darurat stroke (golden hour), serta rehabilitasi pasca-stroke.</p>
          <li className="text-black font-semibold mt-4  mb-1">Layanan Endokrin dan Tiroid</li>
          <p>Diagnostik dan pengobatan penyakit metabolik seperti diabetes, gangguan tiroid, hingga osteoporosis.</p>
          <li className="text-black font-semibold mt-4  mb-1">Bedah Minimal Invasif dan Laparoskopi</li>
          <p>Prosedur bedah dengan sayatan kecil, waktu pemulihan cepat, dan risiko infeksi lebih rendah.</p>
        </ul>
        <p className="mb-1 mt-5">RS Awal Bros juga menyediakan layanan unggulan lainnya seperti Trauma Center 24 Jam, Klinik Gizi & Rehabilitasi Medik, serta Layanan Medical Check-Up 
            Korporat yang dirancang sesuai kebutuhan perusahaan dan ekspatriat.</p>
        <p className="mb-1 mt-5">Didukung oleh sertifikasi akreditasi nasional KARS dan akreditasi internasional JCI, kami terus memperkuat peran sebagai rumah sakit rujukan, tak hanya di 
            Riau dan Kepulauan Riau, tetapi juga bagi pasien dari berbagai provinsi di Indonesia dan mancanegara.</p>
      </div>
    </div>
  );
}
