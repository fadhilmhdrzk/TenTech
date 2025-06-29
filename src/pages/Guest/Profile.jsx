import { useState } from "react";

export default function Profile() {
  const menuItems = [
    "Visi dan Misi",
    "Sejarah",
    "Tugas dan Fungsi",
  ];

  const [active, setActive] = useState("Visi dan Misi");

  const renderContent = () => {
    switch (active) {
      case "Visi dan Misi":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">VISI</h2>
            <p className="mb-4">
              Menjadi jaringan rumah sakit swasta terkemuka yang terpercaya dan berkualitas internasional.
            </p>
            <h2 className="text-xl font-semibold mb-2">MISI</h2>
            <ol className="list-decimal ml-6 space-y-1">
              <li>Memberikan pelayanan kesehatan terbaik dengan profesionalisme dan etika.</li>
              <li>Meningkatkan mutu pelayanan melalui inovasi dan teknologi.</li>
              <li>Mengedepankan keselamatan dan kepuasan pasien.</li>
            </ol>
          </div>
        );
      case "Sejarah":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Sejarah</h2>
            <p>
              Rumah Sakit Awal Bros pertama kali didirikan di Pekanbaru, Riau, pada tahun 1998 oleh seorang pengusaha lokal bernama H. Awaloedin. Nama “Awal Bros” diambil dari nama 
              pendirinya, di mana “Awal” berasal dari Awaloedin dan “Bros” merupakan singkatan dari “brothers”, yang mencerminkan semangat kekeluargaan dan kerja sama. Pendirian rumah 
              sakit ini dilatarbelakangi oleh kebutuhan masyarakat akan layanan kesehatan yang modern, profesional, dan terpercaya di wilayah tersebut. Sejak awal, Awal Bros memiliki 
              visi untuk memberikan pelayanan kesehatan yang berkualitas dan terjangkau, dengan mengedepankan keselamatan pasien serta pemanfaatan teknologi medis terkini. Seiring waktu, 
              rumah sakit ini berkembang pesat dan membuka cabang di berbagai kota besar di Indonesia seperti Jakarta, Tangerang, Batam, dan Makassar. Untuk memastikan standar pelayanan 
              yang tinggi, Awal Bros juga berhasil meraih berbagai akreditasi nasional maupun internasional, termasuk dari Joint Commission International (JCI). Dalam perjalanannya, 
              manajemen Awal Bros terus melakukan transformasi dan inovasi guna meningkatkan mutu layanan serta menjalin kerja sama strategis dengan berbagai institusi kesehatan dan 
              pendidikan.
            </p>
          </div>
        );
      case "Tugas dan Fungsi":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Tugas Utama Rumah Sakit Awal Bros</h2>
            <p className="mb-4">
              Menyelenggarakan pelayanan kesehatan yang profesional, aman, dan bermutu kepada masyarakat. Pelayanan ini mencakup aspek promotif, preventif, kuratif, dan rehabilitatif sesuai dengan standar pelayanan rumah sakit nasional dan internasional.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Fungsi Awal Bros</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Pelayanan Medis:</strong> Memberikan pelayanan kesehatan yang komprehensif, mulai dari layanan umum, spesialis, hingga subspesialis dengan tenaga medis yang kompeten dan berpengalaman.
              </li>
              <li>
                <strong>Pelayanan Keperawatan dan Penunjang Klinis:</strong> Menyediakan layanan keperawatan yang ramah, cepat tanggap, serta dukungan penunjang seperti laboratorium, radiologi, farmasi, dan lainnya.
              </li>
              <li>
                <strong>Pendidikan dan Pelatihan Kesehatan:</strong> Menjadi tempat pelatihan bagi tenaga kesehatan seperti dokter, perawat, dan tenaga medis lainnya dalam rangka pengembangan kompetensi dan profesionalisme.
              </li>
              <li>
                <strong>Penjaminan Mutu dan Keselamatan Pasien:</strong> Menjalankan sistem manajemen mutu yang berkelanjutan serta memastikan setiap tindakan medis mengutamakan keselamatan pasien.
              </li>
              <li>
                <strong>Pengembangan Teknologi dan Inovasi Medis:</strong> Mengadopsi teknologi terbaru dalam bidang kesehatan untuk meningkatkan akurasi diagnosis, efektivitas pengobatan, dan kenyamanan pasien.
              </li>
              <li>
                <strong>Pelayanan Kesehatan Masyarakat:</strong> Berperan aktif dalam kegiatan sosial seperti penyuluhan kesehatan, pemeriksaan gratis, dan program CSR lainnya demi meningkatkan kualitas hidup masyarakat.
              </li>
            </ul>
          </div>
        );
      default:
        return <p className="text-gray-600">Konten belum tersedia.</p>;
    }
  };

  return (
    <div>
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

      <div className="max-w-screen-xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
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

        <section className="w-full lg:w-2/3">
          <div className="bg-white border rounded-lg shadow-md p-6">
            {renderContent()}
          </div>
        </section>
      </div>
    </div>
  );
}
