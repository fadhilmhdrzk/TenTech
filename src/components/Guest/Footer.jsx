import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#e6f4f4] text-white pt-10 pb-6 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Deskripsi */}
        <div>
          <img src="https://home.trilux.id/wp-content/uploads/2020/03/logo-polos-awal-bros.png" alt="Logo RS Awal Bros" className="w-40 mb-4" />
          <h3 className="text-[#00afc5] font-semibold text-lg mb-3">Ikuti Kami</h3>
          <div className="space-x-3 flex">
            <a href="https://www.facebook.com/haloawalbros/" target="_blank" rel="noreferrer" className="text-[#00afc5] hover:text-teal-700"><Facebook className="w-6 h-6" /></a>
            <a href="https://x.com/haloawalbros" target="_blank" rel="noreferrer" className="text-[#00afc5] hover:text-teal-700"><Twitter className="w-6 h-6" /></a>
            <a href="https://www.instagram.com/haloawalbros/" target="_blank" rel="noreferrer" className="text-[#00afc5] hover:text-teal-700"><Instagram className="w-6 h-6" /></a>
            <a href="https://id.linkedin.com/company/awalbroshospitalgroup" target="_blank" rel="noreferrer" className="text-[#00afc5] hover:text-teal-700"><Linkedin className="w-6 h-6" /></a>
            <a href="https://www.youtube.com/@HaloAwalBros" target="_blank" rel="noreferrer" className="text-[#00afc5] hover:text-teal-700"><Youtube className="w-6 h-6" /></a>
            </div>
        </div>

        {/* Tentang Kami */}
        <div>
        <h3 className="font-semibold text-lg mb-3" style={{ color: "#00AFC5" }}>Tentang Kami</h3>
        <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/Footer/Doctor" className="hover:text-black">Our Doctors</Link></li>
            <li><Link to="/Footer/Awards" className="hover:text-black">Awards and Achievements</Link></li>
            <li><Link to="/Footer/Specialities" className="hover:text-black">Our Specialities</Link></li>
        </ul>
        </div>

        {/* Layanan */}
        <div>
        <h3 className="font-semibold text-lg mb-3" style={{ color: "#00AFC5" }}>Tentang Grup RS Awal Bros</h3>
        <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/kontak" className="hover:text-black">Hubungi Kami</a></li>
            <li><a href="/Footer/karir" className="hover:text-black">Karir dan Pelatihan di RS Awal Bros Group</a></li>
            <li><a href="/Footer/Company" className="hover:text-black">Network and Sister Company</a></li>
            <li><a href="/guest" className="hover:text-black">Daftar Online</a></li>
        </ul>
        </div>

        {/* Kontak */}
        {/* Kontak */}
        <div>
            <h3 className="font-semibold text-lg mb-3" style={{ color: "#00AFC5" }}>Kontak</h3>
            <p className="text-sm text-gray-700 hover:text-black">☎ Call Center: 1 500 088</p>
            <p className="text-sm text-gray-700 hover:text-black">📍 Alamat: Jl. Jend. Sudirman No.117, RS Awal Bros, Pekanbaru</p>

            {/* Google Maps Embed */}
            <div className="mt-4">
                <iframe
                title="Lokasi RS Awal Bros Pekanbaru"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15938.64244401232!2d101.4300001536578!3d0.5117176450250935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5aedc9f0cc0eb%3A0x4032c56d33c44b0!2sRS%20Awal%20Bros%20Pekanbaru!5e0!3m2!1sid!2sid!4v1719415681004!5m2!1sid!2sid"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-md shadow-sm"
                ></iframe>
            </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-black mt-10 pt-4 text-center text-xs text-black">
        © {new Date().getFullYear()} Rumah Sakit Awal Bros. All rights reserved.
      </div>
    </footer>
  );
}
