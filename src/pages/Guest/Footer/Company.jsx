import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { useEffect } from "react";

export default function Awards() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const logos = [
    "https://awalbros.com/storage/static/sister-company/cpn.png",
    "https://awalbros.com/storage/static/sister-company/langit-biru.png",
    "https://awalbros.com/storage/static/sister-company/digical.png",
    "https://awalbros.com/storage/static/sister-company/dih.png",
    "https://awalbros.com/storage/static/sister-company/star-dental.png",
    "https://awalbros.com/storage/static/sister-company/starlab.png",
    "https://awalbros.com/storage/static/sister-company/ems.png",
    "https://awalbros.com/storage/static/sister-company/universitas.png"
  ];

  return (
    <main className="px-4 py-6 max-w-6xl mx-auto">
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
        <span className="text-gray-700">Network and Sister Company</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00afc5] mb-4">Network and Sister Company</h1>

      {/* Grid Gambar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 place-items-center">
        {logos.map((url, index) => (
            <div
            key={index}
            className="w-80 h-40 flex items-center justify-center p-4"
            >
            <img
                src={url}
                alt={`Logo ${index + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/160x160?text=Not+Found";
                }}
            />
            </div>
        ))}
      </div>
    </main>
  );
}
