import React from 'react';
import './Kontak.css'; // Pastikan file CSS sudah disiapkan dengan benar

function Kontak() {
  return (
    <div className="kontak-container">
      {/* Bagian Banner */}
      <div className="banner-section">
        <div className="banner-text">
          <h1>Hubungi Kami</h1>
          <p>Kami siap membantu Anda!</p>
        </div>
        <div className="banner-image">
          <img
            src="/src/assets/Guest/gedung.jpg" // Ganti dengan path gambar yang sesuai
            alt="Kontak Kami"
            className="image-banner"
          />
        </div>
      </div>

      {/* Bagian Kantor Wilayah */}
      <div className="kantor-wilayah">
        <h2>Lokasi Kami</h2>
        <div className="kantor-cards">
          <div className="kantor-card hover-effect">
            <h3>RS Awal Bros Sudirman – Pekanbaru</h3>
            <p>Alamat: Jl. Jenderal Sudirman No.117, Kelurahan Tangkerang Selatan, Kecamatan Bukit Raya, Kota Pekanbaru, Riau 28282</p>
            <p>Telepon: (0761) 47333</p>
            <p>Kelas: A</p>
            <p>Status: Rumah Sakit Umum</p>
            <p>Fasilitas: Layanan medis lengkap, termasuk pusat-pusat unggulan seperti Onkologi, Kardiologi, Neurologi, dan lainnya.</p>
            <a href="https://maps.app.goo.gl/1x7dbZAQ2bbKqDnL8" target="_blank" rel="noopener noreferrer" className="website-link">Lihat Lokasi</a>
          </div>
          <div className="kantor-card hover-effect">
            <h3>RS Awal Bros Panam – Pekanbaru</h3>
            <p>Alamat: Jl. HR. Soebrantas No.88, Sialangmunggu, Kecamatan Tampan, Kota Pekanbaru, Riau 28293</p>
            <p>Telepon: (0761) 586888</p>
            <p>Kelas: A</p>
            <p>Status: Rumah Sakit Umum</p>
            <p>Fasilitas: Layanan medis termasuk Oftalmologi, Kardiologi, THT-KL, Gigi dan Mulut, Gastroenterologi, Bedah Umum, Urologi, Obstetri dan Ginekologi.</p>
            <a href="https://maps.app.goo.gl/mQTEpMbzaAS678aa7" target="_blank" rel="noopener noreferrer" className="website-link">Lihat Lokasi</a>
          </div>
          <div className="kantor-card hover-effect">
            <h3>RS Awal Bros A. Yani – Pekanbaru</h3>
            <p>Alamat: Jl. Jend. Ahmad Yani No.73, Tanah Datar, Kecamatan Pekanbaru Kota, Kota Pekanbaru, Riau 28156</p>
            <p>Telepon: (0761) 21000</p>
            <p>Kelas: A</p>
            <p>Status: Rumah Sakit Umum</p>
            <p>Fasilitas: Layanan medis umum dengan fasilitas yang memadai.</p>
            <a href="https://maps.app.goo.gl/D4nV5uZ9WmCyxJox8" target="_blank" rel="noopener noreferrer" className="website-link">Lihat Lokasi</a>
          </div>
          {/* Tambahkan kantor baru */}
          <div className="kantor-card hover-effect">
            <h3>RS Awal Bros Hangtuah – Pekanbaru</h3>
            <p>Jalan Hangtuah No.kelurahan, RW No.121, Bencah Lesung, Kec. Tenayan Raya, Kota Pekanbaru, Riau 28285</p>
            <p>Telepon: (0761) 456789</p>
            <p>Kelas: A</p>
            <p>Status: Rumah Sakit Umum</p>
            <p>Fasilitas: Layanan medis lengkap, termasuk fasilitas unggulan seperti Kardiologi, Oftalmologi, dan lainnya.</p>
            <a href="https://maps.app.goo.gl/e8riUFfdadnvprbC6" target="_blank" rel="noopener noreferrer" className="website-link">Lihat Lokasi</a>
          </div>
        </div>
      </div>

      {/* Bagian Kontak Lainnya */}
      <div className="kontak-lainnya">
        <h2>Kontak Lainnya</h2>
        <div className="kontak-cards">
          <div className="kontak-card hover-effect">
            <i className="fas fa-phone-alt icon"></i>
            <h3>Call Center</h3>
            <p>1500088</p>
          </div>
          <div className="kontak-card hover-effect">
            <i className="fas fa-envelope icon"></i>
            <h3>Email</h3>
            <p>hrd.pekanbaru@awalbros.com</p>
          </div>
          <div className="kontak-card hover-effect">
            <i className="fas fa-share-alt icon"></i>
            <h3>Social Media</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/halo.bros" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/haloawalbros?igsh=c3I2bWw0dW5qcXBu" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://x.com/awalbrospku?s=11" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://youtube.com/@haloawalbros?si=DrRsh2ywKVNtO072" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kontak;
