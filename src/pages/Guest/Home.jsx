import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Home() {
  const apps = [
    {
      title: "Stardok",
      image: "https://awalbros.com/storage/uploads/67ab14d14664cqHm8lpD2L0UDEvED3XlIwi2aN74G8i3IvY3vogno.jpg",
      download: {
        ios: "https://www.apple.com/id/",
        android: "https://play.google.com/store/apps/details?id=com.hab.mobile&hl=en"
      }
    },
    {
      title: "Halo Awal Bros",
      image: "https://awalbros.com/storage/uploads/67ab14d146f69dQG6uFOUwxgWSZOSSfLoBAVjwx280zI2L7CwUIoW.jpg",
      download: {
        ios: "https://www.apple.com/id/",
        android: "https://play.google.com/store/apps/details?id=com.hab.mobile&hl=en"
      }
    },
    {
      title: "Mobile JKN",
      image: "https://awalbros.com/storage/static/images/apps/jkn.png",
      download: {
        ios: "https://apps.apple.com/id/app/mobile-jkn/id1237601115?l=en",
        android: "https://play.google.com/store/apps/details?id=app.bpjs.mobile&hl=en"
      }
    }
  ];

  return (
    <>
      {/* Hero Slider */}
      <div className="relative w-full overflow-hidden h-[800px]">
        <Swiper
          navigation={true}
          loop={true}
          autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          }}
          modules={[Navigation]}
          className="w-full h-full"
        >
          {[
            "https://awalbros.com/storage/uploads/681d8912f3f955yZFXT12pXWX14cD9ImFMxTUHweesMlKPybXZqV7.jpg",
            "https://rsusaifulanwar.jatimprov.go.id/wp-content/uploads/2025/04/Untitled3.jpg",
            "https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2024/05/11/948210629.jpg",
            "https://prokopim.bengkaliskab.go.id/asset/berita/original/9827794733-dio_2403.jpg",
            "https://www.inhilnews.com/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-23-at-17.20.55.jpeg",
          ].map((img, idx) => (
            <SwiperSlide key={idx} className="flex justify-center items-center">
              <img
                src={img}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 bg-black/30 z-10 pointer-events-none">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
            RS Awal Bros:<br />Inovasi Digital <br />Rumah Sakit Terbaik<br />untuk Kesehatan Anda
          </h1>
          <p className="text-lg font-bold drop-shadow-md">
            Solusi praktis: Booking online dan konsultasi cepat hanya di RS AwalBros
          </p>
        </div>
      </div>

      {/* Featured Services */}
      <div className="py-12 bg-white w-full px-4 md:px-16">
        <h2 className="text-4xl font-bold text-center mt-12 mb-6 text-[#00afc5]">
          Featured Services
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 px-4 md:px-8 place-items-center">
          {[
            "https://awalbros.com/storage/static/logo-coe/ic-alarm-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-cardiac-vasculan-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-trauma-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-eye-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-neurology-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-ear-nose-throat-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-oncology-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-mother-child-care-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-wellness-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-uro-nephrology-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-gastroenterology-hepatology-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-endocrine-diabetes-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-minimal-invasive-surgery-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-dental-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-hyperbaric-oxygen.png",
            "https://awalbros.com/storage/static/logo-coe/ic-rehabilitation-care-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-sport-center.png",
            "https://awalbros.com/storage/static/logo-coe/ic-allergy-immunology-care-center.png",
          ].map((img, idx) => (
            <div key={idx} className="flex justify-center items-center p-2">
              <img
                src={img}
                alt={`Service ${idx + 1}`}
                className="h-20 w-auto object-contain hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x100?text=Icon";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Health Apps Section */}
      <div className="py-16 px-4 md:px-16 bg-[#f7f7f7]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {apps.map((app, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center"
            >
              <h3 className="text-xl font-semibold text-black mb-3">{app.title}</h3>
              <img
                src={app.image}
                alt={app.title}
                className="h-48 object-contain mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/200x200?text=No+Image";
                }}
              />
              <p className="text-gray-700 text-sm mb-4">{app.desc}</p>
              <div className="flex gap-2">
                <a href={app.download.ios} target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://awalbros.com/images/icons/ic-app-store.png"
                    alt="App Store"
                    className="h-10"
                  />
                </a>
                <a href={app.download.android} target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://awalbros.com/images/icons/ic-google-play.png"
                    alt="Google Play"
                    className="h-10"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Section */}
      <div className="mt-10 w-full flex justify-center">
        <div className="w-full max-w-6xl px-4">
          <div className="aspect-video w-full mb-10 rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/Yh7c6y5DqEM"
              title="Layanan Tunas Bangsa"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
