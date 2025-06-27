import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // <<< IMPORT BARU: Supabase client
// import axios from "axios"; // <<< DIHAPUS: Tidak lagi diperlukan
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({
    username: "", // Ini akan digunakan sebagai full_name awal pasien
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!dataForm.username || !dataForm.email || !dataForm.password || !dataForm.confirmPassword) {
      setError("Semua kolom wajib diisi."); // <<< DIUBAH
      setLoading(false);
      return;
    }

    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Kata sandi tidak cocok."); // <<< DIUBAH
      setLoading(false);
      return;
    }

    // Validasi kata sandi minimum (sesuaikan dengan kebijakan Supabase jika ada)
    if (dataForm.password.length < 6) { // Supabase default min password is 6 characters
      setError("Kata sandi harus minimal 6 karakter."); // <<< DIUBAH
      setLoading(false);
      return;
    }

    try {
      // --- Menggunakan Supabase Auth untuk Pendaftaran ---
      const { data, error: authError } = await supabase.auth.signUp({
        email: dataForm.email,
        password: dataForm.password,
        // Supabase bisa mengirim email konfirmasi, perhatikan setting Anda di dashboard
      });

      if (authError) {
        throw authError; // Lempar error dari Supabase Auth
      }

      // --- Jika pendaftaran Auth berhasil, buat entri di tabel patients ---
      // Data.user akan tersedia jika tidak ada konfirmasi email yang dibutuhkan
      // Jika konfirmasi email diaktifkan, data.user mungkin null sampai dikonfirmasi
      const user = data.user;

      if (user) {
        const { error: patientError } = await supabase
          .from('patients')
          .insert({
            auth_id: user.id, // ID pengguna dari Supabase Auth
            full_name: dataForm.username.trim(), // Gunakan username sebagai nama awal pasien
            email: dataForm.email.trim(),
            // Kolom lain bisa diisi nanti di halaman profil atau tiket
          });

        if (patientError) {
          // Tangani error jika gagal membuat entri pasien
          // Mungkin ingin menghapus juga akun Auth jika ini terjadi
          console.error("Kesalahan membuat entri pasien:", patientError);
          setError("Gagal membuat profil pasien. Harap coba lagi atau hubungi admin."); // <<< DIUBAH
          // Opsional: supabase.auth.admin.deleteUser(user.id);
          return;
        }
      } else {
        // Ini terjadi jika Supabase Auth membutuhkan konfirmasi email
        // Pengguna perlu memeriksa email mereka untuk konfirmasi
        setError("Akun berhasil dibuat. Harap periksa email Anda untuk memverifikasi akun sebelum login."); // <<< DIUBAH
        setLoading(false); // Selesai loading, tapi tidak navigasi
        return;
      }

      console.log("Pengguna berhasil mendaftar dan profil pasien dibuat."); // <<< DIUBAH
      navigate("/login"); // Arahkan ke halaman login setelah registrasi berhasil

    } catch (err) {
      console.error("Kesalahan pendaftaran:", err); // Log error lengkap
      // Menampilkan pesan error yang lebih user-friendly dari Supabase Auth
      if (err.message.includes("User already registered")) { // Pesan umum jika email sudah terdaftar
        setError("Email sudah terdaftar. Harap masuk atau gunakan email lain."); // <<< DIUBAH
      } else {
        setError(err.message || "Terjadi kesalahan yang tidak diketahui saat mendaftar."); // <<< DIUBAH
      }
    } finally {
      setLoading(false);
    }
  };

  const errorInfo = error ? (
    <div className="bg-red-200 mb-5 p-5 text-sm font-light text-gray-600 rounded flex items-center">
      <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg" />
      {error}
    </div>
  ) : null;

  const loadingInfo = loading ? (
    <div className="bg-gray-200 mb-5 p-5 text-sm rounded flex items-center">
      <ImSpinner2 className="me-2 animate-spin" />
      Mohon Tunggu... {/* <<< DIUBAH */}
    </div>
  ) : null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg relative">
        <img
          src="/src/assets/Guest/Logo.webp" // Menggunakan path gambar logo
          alt="Logo"
          className="absolute top-4 left-4 w-12 h-12"
        />
         <h1 className="text-5xl font-bold text-[#00B5E2] mb-6 text-center">
          Daftar {/* <<< DIUBAH */}
        </h1>
        <h2 className="text-2xl font-medium text-gray-500 mb-6 text-center">
          Buat Akun Anda ✨ {/* <<< DIUBAH */}
        </h2>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pengguna {/* <<< DIUBAH */}
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="nama_pengguna_anda" // <<< DIUBAH
              name="username"
              onChange={handleChange}
              required // Tambahkan required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Email {/* <<< DIUBAH */}
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="anda@contoh.com" // <<< DIUBAH
              name="email"
              onChange={handleChange}
              required // Tambahkan required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi {/* <<< DIUBAH */}
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="********"
              name="password"
              onChange={handleChange}
              required // Tambahkan required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Kata Sandi {/* <<< DIUBAH */}
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="********"
              name="confirmPassword"
              onChange={handleChange}
              required // Tambahkan required
            />
          </div>

         <button
  type="submit"
  className="w-full bg-[#00B5E2] hover:bg-[#00A0C6] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
>
            Daftar {/* <<< DIUBAH */}
          </button>
        </form>

        <div className="text-sm text-center text-blue-600 hover:underline mt-4">
          <a href="/login">Sudah punya akun? Masuk di sini</a> {/* <<< DIUBAH */}
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-600">
          <p>© 2025 RS. Awal Bros Pekanbaru. Hak cipta dilindungi undang-undang.</p> {/* <<< DIUBAH */}
        </footer>
      </div>
    </div>
  );
}