import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function Panam() {
    return(
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
        <span className="text-gray-700">RS Awal Bros Panam</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600 mb-4">RS Awal Bros Panam</h1>

      {/* Gambar */}
      <img src="https://awalbros.com/storage/static/logo-our-hospital/rs-awal-bros-panam.jpg" alt="RS Awal Bros Panam" className="w-full object-cover rounded-md"/>

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="mb-4">
          Sejak berdiri pada Januari 2014, PT AWAL BROS KARYA MEDIKA atau dikenal dengan nama Rumah Sakit Awal Bros Panam telah menjadi pilihan utama masyarakat Panam dan sekitarnya 
          dalam mendapatkan layanan kesehatan berkualitas. Berlokasi di JL. HR Soebrantas No. 88 (Kode Pos: 28299), Rumah Sakit Awal Bros Panam mengutamakan kenyamanan pasien dengan 
          menyediakan kapasitas 269 tempat tidur dan layanan kesehatan terakreditasi nasional dari Komite Akreditasi Rumah Sakit (KARS).
        </p>
        <p className="font-semibold mb-2">RS Awal Bros Panam menyediakan berbagai layanan kesehatan komprehensif, antara lain:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Klinik Memori: Layanan khusus untuk diagnosis dan perawatan gangguan memori serta pencegahan risiko demensia.</li>
          <li>Trauma Center: Penanganan darurat yang profesional untuk berbagai cedera, kecelakaan, atau trauma.</li>
          <li>Home Care: Layanan perawatan kesehatan yang nyaman langsung di rumah, untuk kebutuhan khusus tanpa harus datang ke rumah sakit.</li>
          <li>Stroke Center: Penanganan terpadu untuk pasien stroke, mulai dari diagnosis, terapi, hingga rehabilitasi.</li>
          <li>Pain Intervention: Layanan manajemen nyeri bagi pasien dengan kondisi kronis, membantu meningkatkan kualitas hidup.</li>
        </ul>
        <p className="font-semibold mt-4 mb-2">‍Layanan Terintegrasi di Jaringan RS Awal Bros</p>
        <p className="mb-4">Sebagai bagian dari jaringan RS Awal Bros, RS Awal Bros Panam menawarkan layanan kesehatan yang terintegrasi, memastikan pasien mendapatkan perawatan yang 
            holistik dan optimal. Dalam proses diagnosis, terapi, hingga rehabilitasi, pasien akan mendapatkan akses penuh ke layanan yang didukung oleh tim medis dan fasilitas 
            terbaik dari seluruh RS Awal Bros.</p>
        <p className="font-semibold mb-2">Dukungan untuk Gaya Hidup Sehat</p>
        <p className="mb-4">Selain berfokus pada perawatan dan penyembuhan, RS Awal Bros Panam juga menyediakan paket pemeriksaan kesehatan (medical check-up) yang dirancang untuk 
            mendeteksi risiko kesehatan sejak dini. Pemeriksaan kesehatan rutin ini membantu pasien menjalani hidup sehat dengan deteksi dan pencegahan yang tepat waktu.</p>
        <p className="font-semibold mt-4 mb-2">Mengapa Memilih RS Awal Bros Panam?</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Lokasi strategis di pusat Panam. Hanya 10 menit dari pusat perbelanjaan Mall SKA dan Mall Living World, RS Awal Bros Panam mudah diakses oleh pasien dari Panam dan sekitarnya.</li>
          <li>Layanan unggulan yang menyeluruh. Mulai dari perawatan memori hingga manajemen nyeri, kami menyediakan solusi kesehatan yang lengkap sesuai kebutuhan pasien.</li>
          <li>Standar keselamatan pasien yang tinggi. Sebagai rumah sakit terakreditasi KARS, RS Awal Bros Panam berkomitmen pada kualitas dan keselamatan dalam setiap layanan yang diberikan.</li>
          <li>Paket pemeriksaan kesehatan untuk deteksi dini. Layanan medical check-up kami membantu Anda menjaga kesehatan secara proaktif dengan deteksi dini untuk pencegahan yang lebih baik.</li>
        </ul>
      </div>
    </div>
    );
}