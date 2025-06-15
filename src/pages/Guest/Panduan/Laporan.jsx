import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function Laporan() {
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
        <span className="text-gray-700">Permintaan Laporan Medis</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-600 mb-4">Permintaan Laporan Medis</h1>

      {/* Gambar */}
      <img src="https://awalbros.com/storage/uploads/681db595e8310Xs7D54YgvUJIyWdsMZp54BfLRfG7HMT7BXHfzFIr.jpg" alt="Laporan Medis" className="w-full object-cover rounded-md"/>

      {/* Deskripsi */}
      <div className="mt-6 text-justify text-gray-800 leading-relaxed">
        <p className="mb-4">
            Ada berbagai cara yang dapat Anda lakukan untuk meminta rekam medis ke pihak rumah sakit. Antara lain, Anda dapat meminta rekam medis dengan menghubungi pihak rumah sakit 
            terlebih dahulu, kemudian membawa kelengkapan berupa syarat dan ketentuan yang sebelumnya diminta oleh pihak rumah sakit.
        </p>
      </div>
    </div>
  );
}
