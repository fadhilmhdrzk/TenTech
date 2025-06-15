import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Home() {
  const slides = [
    "https://awalbros.com/storage/uploads/681d8912f3f955yZFXT12pXWX14cD9ImFMxTUHweesMlKPybXZqV7.jpg",
    "https://rsusaifulanwar.jatimprov.go.id/wp-content/uploads/2025/04/Untitled3.jpg",
  ];

  return (
    <div className="relative w-screen h-[700px] overflow-hidden bg-black">
      {/* Swiper untuk gambar */}
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="w-full h-full"
      >
        {slides.map((img, idx) => (
          <SwiperSlide key={idx} className="flex justify-center items-center">
            <img
              src={img}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Teks di atas gambar */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 bg-black/30 z-10 pointer-events-none">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
          RS Awal Bros:
          <br />
          Inovasi Digital <br />
          Rumah Sakit Terbaik
          <br />
          untuk Kesehatan Anda
        </h1>
        <p className="text-lg font-bold drop-shadow-md">
          Solusi praktis: Booking online dan konsultasi cepat hanya di RS Awal
          Bros
        </p>
      </div>
    </div>
  );
}
