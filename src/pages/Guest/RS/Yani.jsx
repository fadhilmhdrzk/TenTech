import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function Yani() {
    return (
        <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center space-x-1 mb-2">
        <Link to="/" className="text-gray-500 hover:text-teal-600 transition-colors duration-200 flex items-center gap-1">
          <span><AiFillHome /></span>
          <span>Home</span>
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">RS Awal Bros A.Yani</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600 mb-4">RS Awal Bros A.Yani</h1>

      {/* Gambar */}
      <img src="https://awalbros.com/storage/static/logo-our-hospital/rs-awal-bros-a-yani.jpg" alt="RS Awal Bros Yani" className="w-full object-cover rounded-md"/>

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="mb-4">
          Rumah Sakit Awal Bros A. Yani, yang sebelumnya dikenal sebagai Klinik A. Yani, telah melayani pasien sejak 2007 dan resmi bergabung sebagai bagian dari RS Awal Bros pada tahun 
          2015. Terletak di Jalan Jenderal Ahmad Yani, Pekanbaru, dan berseberangan dengan Kodim 0301, RS Awal Bros A. Yani menyediakan layanan kesehatan berkualitas dengan kapasitas 
          201 tempat tidur yang siap melayani masyarakat Pekanbaru dan sekitarnya.
        </p>
        <p className="font-semibold mt-4 mb-2">‍Layanan Terintegrasi di Jaringan RS Awal Bros A.Yani</p>
        <p className="mb-4">
            RS Awal Bros A. Yani menawarkan layanan kesehatan komprehensif yang mencakup seluruh proses perawatan, mulai dari diagnosa, tindakan medis, hingga terapi dan rehabilitasi. 
            Dengan dukungan jaringan Rumah Sakit Awal Bros lainnya, kami memastikan setiap pasien mendapatkan perawatan yang terintegrasi dan holistik.
        </p>
        <p className="font-semibold mt-4 mb-2">Paket Pemeriksaan Kesehatan untuk Gaya Hidup Sehat</p>
        <p className="mb-4">Selain layanan medis, RS Awal Bros A. Yani menyediakan paket pemeriksaan kesehatan (medical check-up) untuk membantu pasien menjaga kesehatan secara proaktif. 
            Dengan pemeriksaan kesehatan berkala, pasien dapat mendeteksi risiko penyakit lebih awal dan mendapatkan rekomendasi pencegahan yang tepat.
        </p>
        <p className="font-semibold mt-4 mb-2">Mengapa Memilih RS Awal Bros A.Yani?</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Lokasi Strategis di Pusat Kota Pekanbaru</li>
          <li>Terletak di Jalan Jenderal Ahmad Yani, RS Awal Bros A. Yani mudah diakses oleh pasien dari Pekanbaru dan sekitarnya.</li>
        </ul>
        <p className="font-semibold mt-4 mb-2">Komitmen pada Keselamatan dan Kualitas Pelayanan</p>
        <p className="mb-4">
            Setiap layanan di RS Awal Bros A. Yani berfokus pada keselamatan pasien, memastikan Anda mendapatkan perawatan terbaik sesuai standar RS Awal Bros.
        </p>
        <p className="font-semibold mt-4 mb-2">Dukungan Pemeriksaan Kesehatan untuk Deteksi Dini</p>
        <p className="mb-4">
            Dengan layanan medical check-up yang lengkap, kami mendukung kesehatan proaktif untuk menjaga kualitas hidup Anda. 
        </p>
      </div>
    </div>
    );
}