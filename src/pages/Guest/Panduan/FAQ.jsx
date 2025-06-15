import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

export default function FAQ() {
  const faqs = [
    {
      question: "Apa saja layanan unggulan di RS Awal Bros?",
      answer: (
        <>
          <p className="mt-3 mb-2">
            Di RS Awal Bros, kami menyediakan berbagai layanan kesehatan yang
            spesialis dan menyeluruh, dirancang untuk memenuhi kebutuhan pasien
            dari Provinsi Riau, Kepulauan Riau, dan sekitarnya. Layanan unggulan
            kami meliputi:
          </p>
          <ul className="list-disc pl-8 space-y-3 mb-2">
            <li>Pusat Jantung & Pembuluh Darah – Teknologi terkini</li>
            <li>Pusat Neurologi & Stroke – Penanganan saraf terintegrasi</li>
            <li>Layanan Onkologi – Pengobatan kanker dengan multidisiplin</li>
            <li>Medical Check-Up (MCU) – Individu & korporasi</li>
            <li>Layanan Gawat Darurat – IGD 24 jam, tim berpengalaman</li>
            <li>Pusat Ibu & Anak – Kehamilan & neonatal intensif</li>
            <li>Radiologi – CT scan, MRI, USG, lab</li>
            <li>Ortopedi & Rehabilitasi – Tulang, sendi, pasca operasi</li>
            <li>Dan lainnya</li>
          </ul>
          <p className="mt-3 mb-2">Kami berkomitmen memberikan layanan kesehatan berstandar internasional di seluruh jaringan RS Awal Bros Pekanbaru, Batam, Dumai, Ujung Batu, dan 
            Bagan Batu.</p>
          <p className="mt-3 mb-2">
            <span className="mr-2">Lihat info lengkap layanan kami di</span>
            <Link to="/" className="hover:text-teal-600 transition-colors duration-200 inline" style={{ color: "#a20000" }}>www.awalbros.com </Link>– mitra kesehatan terpercaya Anda di 
                Riau dan Kepulauan Riau.
          </p>
          <div className="mt-6 mb-2">
            <Link to="/daftar" className="bg-cyan-500 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300">DAFTAR DISINI</Link>
          </div>
        </>
      ),
    },
    {
      question: "Di Mana Lokasi RS Awal Bros Terdekat?",
      answer: (
        <>
          <p className="mt-3 mb-2">Sedang mencari rumah sakit terbaik di Riau dan Kepulauan Riau? RS Awal Bros hadir di berbagai kota strategis seperti Pekanbaru, Batam, Ujung Batu, Dumai, 
            dan Bagan Batu siap melayani kebutuhan kesehatan Anda dengan standar pelayanan bertaraf internasional.</p>
          <p className="mt-3 mb-2">Setiap cabang RS Awal Bros menawarkan layanan medis unggulan, fasilitas modern, dan tenaga dokter spesialis berpengalaman. Cocok untuk pasien lokal 
            maupun dari luar kota yang ingin berobat ke Riau atau Kepulauan Riau.</p>
          <p className="mt-3 mb-2">
            <span className="mr-2">Temukan lokasi RS Awal Bros terdekat dan informasi lengkapnya di</span>
            <Link to="/" className="hover:text-teal-600 transition-colors duration-200 inline" style={{ color: "#a20000" }}>www.awalbros.com </Link>
            – rumah sakit pilihan keluarga Indonesia di Pekanbaru, Batam, dan sekitarnya.
          </p>
        </>
      ),
    },
    {
      question: "Apakah RS Awal Bros Menerima Pasien BPJS, Asuransi Swasta, dan Umum?",
      answer: (
        <>
            <p className="mb-2">Ya, RS Awal Bros menerima pasien dari berbagai jalur layanan, termasuk :</p>
            <ul className="list-disc pl-8 space-y-3 mb-2">
                <li>BPJS Kesehatan</li>
                <li>Asuransi kesehatan swasta</li>
                <li>Pasien umum (pembayaran pribadi)</li>
            </ul>
            <p className="mt-3 mb-2">Kami bekerja sama dengan berbagai perusahaan asuransi nasional dan internasional, untuk memudahkan proses administrasi dan klaim pasien. Bagi pasien 
                BPJS, layanan yang tersedia sesuai dengan ketentuan rujukan dan prosedur dari Fasilitas Kesehatan Tingkat Pertama (FKTP).</p>
            <p className="mt-3 mb-2">Untuk pasien umum, Anda dapat langsung melakukan pendaftaran melalui Call Center 1500 088, atau menggunakan aplikasi Halo Awal Bros dan Stardok.</p>
            <p className="mt-3 mb-2">
            <span className="mr-2">Lihat daftar lengkap rekanan asuransi dan panduan berobat di</span>
                <Link to="/" className="hover:text-teal-600 transition-colors duration-200 inline" style={{ color: "#a20000" }}>www.awalbros.com </Link>
            – rumah sakit terpercaya untuk pelayanan BPJS, asuransi swasta, dan pasien umum di Riau dan Kepulauan Riau.
          </p>
        </>
      ),
    },
    {
      question: "Apa Jam Operasional Rumah Sakit, Layanan IGD, dan Jam Besuk di RS Awal Bros?",
      answer: (
        <>
            <p className="mb-2">RS Awal Bros Group berkomitmen memberikan layanan kesehatan yang mudah diakses oleh pasien dari Provinsi Riau, Kepulauan Riau, dan sekitarnya. Berikut 
                jam operasional kami :</p>
            <ul className="list-disc pl-8 space-y-3 mb-2">
                <li>
                    <div>
                        <span className="font-semibold">Layanan IGD (Instalasi Gawat Darurat)</span>
                        <p className="mt-1 text-sm text-gray-700">Tersedia 24 jam setiap hari, termasuk hari libur nasional. 
                            <br/>Pasien dengan kondisi darurat bisa langsung datang tanpa perlu janji temu.
                        </p>
                    </div>
                </li>
                <li>
                    <div>
                        <span className="font-semibold">Layanan Poliklinik dan Rawat Jalan</span>
                        <p className="mt-1 text-sm text-gray-700">Senin – Sabtu: 08.00 – 20.00 WIB 
                            <br/>Minggu: 08.00 – 12.00 WIB
                            <br/>(Hari dan jam bisa berbeda di setiap cabang. Silakan cek jadwal dokter di
                            <Link to="/" className="hover:text-teal-600 transition-colors duration-200 inline" style={{ color: "#a20000" }}> www.awalbros.com</Link>)
                        </p>
                    </div>
                </li>
                <li>
                    <div>
                        <span className="font-semibold">Jam Besuk Pasien</span>
                        <p className="mt-1 text-sm text-gray-700">Setiap hari: 17.00 – 18.00 WIB</p>
                    </div>
                </li>
            </ul>
            <p className="mt-3 mb-2">
                <span className="mr-2">Untuk informasi terbaru terkait jadwal dan layanan, kunjungi</span>
                <Link to="/" className="hover:text-teal-600 transition-colors duration-200 inline" style={{ color: "#a20000" }}>www.awalbros.com </Link>
                – rumah sakit pilihan untuk layanan kesehatan 24 jam di Pekanbaru, Batam, Ujung Batu, Bagan Batu, dan Dumai.
          </p>
        </>
      ),
    },
    {
      question: "Bagaimana Cara Membuat Janji Temu dengan Dokter di RS Awal Bros?",
      answer: (
        <>
            <p className="mt-3 mb-2">Membuat janji temu dengan dokter di RS Awal Bros sangat mudah dan praktis. Anda dapat memilih salah satu cara berikut :</p>
            <ul className="list-disc pl-8 space-y-3 mb-2">
                <li>Hubungi Call Center 1500 088 – Tersedia setiap hari untuk membantu Anda memilih dokter dan jadwal yang sesuai.</li>
                <li>Gunakan Aplikasi Halo Awal Bros – Unduh aplikasinya untuk daftar online, lihat jadwal dokter, dan booking tanpa antre.</li>
                <li>Daftar melalui Website Resmi – Kunjungi <Link to="/" className="hover:text-teal-600 transition-colors duration-200 inline" style={{ color: "#a20000" }}> 
                www.awalbros.com </Link>untuk melihat jadwal dokter dan melakukan pendaftaran online langsung dari rumah.</li>
            </ul>
            <p className="mt-3 mb-2">Pastikan Anda menyiapkan data diri, nomor kontak aktif, dan keluhan medis, agar tim kami dapat memberikan pelayanan yang cepat dan sesuai kebutuhan.</p>
            <p className="mt-3 mb-2">Layanan ini tersedia di seluruh jaringan RS Awal Bros di Pekanbaru, Batam, Tanjungpinang, Duri, Ujung Batu, Bagan Batu, dan Dumai.</p>
            <div className="mt-6 mb-2">
                <Link to="/daftar" className="bg-cyan-500 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300">DAFTAR DISINI</Link>
            </div>
        </>
      ),
    },
  ];

  const [openStates, setOpenStates] = useState(faqs.map(() => false));

  const toggleFAQ = (index) => {
    const newStates = [...openStates];
    newStates[index] = !newStates[index];
    setOpenStates(newStates);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Link className="hover:text-teal-600 transition-colors duration-200 flex items-center gap-1">
          <AiFillHome />
          <span>Home</span>
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">FAQ</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-cyan-600 mb-6">Frequently Asked Questions</h1>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openStates[index];
          return (
            <div key={index} className="bg-cyan-50 rounded-md shadow border border-cyan-100 overflow-hidden">
              <button onClick={() => toggleFAQ(index)} className="flex justify-between items-center w-full px-4 py-3 font-semibold text-[#a20000] text-md md:text-lg">
                <span className="flex items-center">{isOpen ? (<FaMinus className="mr-2" />) : (<FaPlus className="mr-2" />)} {faq.question}</span>
              </button>
              <div className={`transition-all duration-400 ease-in-out ${ isOpen ? "max-h-[1000px]" : "max-h-0" } overflow-hidden`}>
                <div className="bg-white px-4 py-4 text-sm text-gray-800 border-t border-cyan-100">{faq.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
