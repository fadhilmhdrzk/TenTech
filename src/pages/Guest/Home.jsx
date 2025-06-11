import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="space-y-20">
            {/* Home Section */}
            <section id="home" className="flex flex-col md:flex-row items-center justify-between px-8 py-20 bg-blue-50">
                <div className="md:w-1/2">
                    <h1 className="text-6xl font-bold mb-4 text-black-600">Selamat datang di Sedap!</h1>
                    <p className="text-gray-600 mb-6">Temukan beragam hidangan favoritmu dengan cita rasa istimewa.</p>
                    <Link to="/login">
                        <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition">Pesan Sekarang</button>
                    </Link>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                    <img
                        src="https://assets.telkomsel.com/public/2024-10/4581.png"
                        alt="Promo Sedap"
                        className="rounded-full w-full"
                    />
                </div>
            </section>

            {/* About Us*/}
            <section className="flex flex-col md:flex-row items-center justify-between px-1 py-8 bg-white rounded-lg shadow-md mx-4">
                <div className="md:w-1/2 mb-6 md:mb-0">
                    <img
                        src="https://i.pinimg.com/736x/3f/26/a5/3f26a59db215ea9cc3830a28a74f941b.jpg"
                        alt="Interior Example"
                        className="rounded-lg shadow-md max-w-md mx-auto"
                    />
                </div>
                <div className="md:w-1/2 md:pl-8">
                    <p className="text-red-500 font-semibold mb-2 uppercase tracking-wide text-sm">Tentang Kami</p>
                    <h2 className="text-3xl font-bold mb-3 leading-snug">Nikmati Sensasi Kuliner yang Tak Terlupakan</h2>
                    <p className="text-gray-600 mb-4 text-sm">
                        Kami hadir untuk menyuguhkan pengalaman kuliner terbaik dengan rasa khas yang menggoda selera.
                        Dari menu tradisional hingga modern, Sedap siap menemani setiap momen spesial Anda.
                    </p>
                    <Link to="/About">
                        <button className="bg-red-500 text-white px-5 py-2 text-sm rounded hover:bg-red-600 transition"><b>Discover More</b></button>
                    </Link>
                </div>
            </section>

            {/* Fasilitas Unggulan */}
            <section className="px-6 py-16 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">Fasilitas Unggulan Kami</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {[
                        { icon: "🍽️", label: "Delicious Food" },
                        { icon: "🅿️", label: "Parking Area" },
                        { icon: "🧒", label: "Area Ramah Anak" },
                        { icon: "🎶", label: "Musik Live" },
                        { icon: "📦", label: "Layanan Takeaway" },
                        { icon: "📶", label: "Free Wifi" },
                        { icon: "☕", label: "Breakfast" },
                        { icon: "⚙️", label: "Other Service" },
                    ].map((facility, index) => (
                        <div key={index} className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition flex flex-col items-center">
                            <div className="text-4xl mb-4">{facility.icon}</div>
                            <p className="text-center font-semibold text-gray-700">{facility.label}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}