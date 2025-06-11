import { useState } from "react";

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
            {/* Gambar Header Tetap Muncul */}
            <div className="relative w-full h-64 lg:h-80 bg-white flex items-center overflow-hidden mb-8">
                {/* Kiri: Judul & Breadcrumb */}
                <div className="w-1/2 px-10 z-10">
                    <h1 className="text-3xl font-bold text-blue-900">Profil</h1>
                    <p className="text-sm text-blue-700 font-medium mt-1">Beranda / Profil</p>
                </div>

                {/* Kanan: Gambar & Overlay */}
                <div className="absolute right-0 top-0 w-1/2 h-full">
                    <img
                        src="https://www.lowongankerjaterupdate.com/wp-content/uploads/2022/09/LOGO-Rumah-sakit-awal-bros.png"
                        alt="Visi Misi"
                        className="object-contain w-full h-full opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <h2 className="text-white text-3xl font-bold">VISI DAN MISI</h2>
                    </div>
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
                                className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-blue-50 ${active === item ? "bg-blue-100 font-semibold" : ""}`}
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
