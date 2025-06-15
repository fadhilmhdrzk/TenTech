import { useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const menuItems = [
    "Visi dan Misi",
    "Struktur Organisasi",
    "Sejarah",
    "Landasan Hukum",
    "Tugas dan Fungsi",
    "Budaya Organisasi",
    "Direksi",
    "Dewan Pengawas",
    "Senior Leader",
  ];
  const [active, setActive] = useState("Visi dan Misi");

  const renderContent = () => {
    switch (active) {
      case "Visi dan Misi":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">VISI DAN MISI BPJS KESEHATAN</h2>
            <h3 className="font-bold mb-1">VISI</h3>
            <p className="mb-4">
              Menjadi badan penyelenggara yang <strong>dinamis</strong>, <strong>akuntabel</strong>,
              dan <strong>terpercaya</strong> untuk mewujudkan jaminan kesehatan yang
              <strong> berkualitas</strong>, <strong>berkelanjutan</strong>, <strong>berkeadilan</strong>,
              dan <strong>inklusif</strong>.
            </p>
            <h3 className="font-bold mb-1">MISI</h3>
            <ol className="list-decimal ml-6 space-y-1">
              <li>Meningkatkan kualitas layanan kepada peserta melalui layanan terintegrasi berbasis teknologi informasi.</li>
              <li>Menjaga keberlanjutan Program JKN-KIS dengan menyimbangkan antara dana jaminan sosial dan biaya manfaat yang terkendali.</li>
              <li>Memberikan jaminan kesehatan yang berkeadilan dan inklusif mencakup seluruh penduduk Indonesia.</li>
              <li>Memperkuat <em>engagement</em> dengan meningkatkan sinergi dan kolaborasi para pemangku kepentingan dalam mengimplementasikan program JKN-KIS.</li>
              <li>Meningkatkan kapabilitas Badan dalam menyelenggarakan Program JKN-KIS secara efisien dan efektif yang akuntabel, berkehatian-hatian, dan dengan prinsip tata kelola yang baik.</li>
            </ol>
          </div>
        );
      default:
        return <p className="text-gray-600">Konten {active} belum tersedia.</p>;
    }
  };

  return (
    <div>
      {/* Header Gambar Full */}
      <div className="relative w-full h-[320px] lg:h-[400px] overflow-hidden mb-8">
        <img
          src="https://bumnreview.com/wp-content/uploads/2024/07/Rs-Awal-Bros-Botania-Batam.jpg"
          alt="Header"
          className="absolute inset-0 w-full h-full object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="relative z-20 flex flex-col justify-center h-full px-6 md:px-10 lg:px-16">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Profil</h1>
          <p className="text-sm text-blue-700 font-medium">Beranda / Profil</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Menu */}
        <aside className="w-full lg:w-1/3">
          <div className="bg-white border rounded-lg shadow-md">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-blue-50 ${
                  active === item ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        {/* Konten Aktif */}
        <section className="w-full lg:w-2/3">
          <div className="bg-white border rounded-lg shadow-md p-6">
            {renderContent()}
          </div>
        </section>
      </div>
    </div>
  );
}
