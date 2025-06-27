import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // <<< IMPORT BARU: Supabase client
// import axios from "axios"; // <<< DIHAPUS: Tidak lagi diperlukan
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
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

    // Validasi Form
    if (!dataForm.email || !dataForm.password) {
      setError("Email dan kata sandi wajib diisi."); // <<< DIUBAH
      setLoading(false);
      return;
    }

    try {
      // --- Menggunakan Supabase Auth untuk Login ---
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: dataForm.email,
        password: dataForm.password,
      });

      if (authError) {
        throw authError; // Lempar error dari Supabase Auth
      }

      // Jika login berhasil, data.user akan berisi objek pengguna
      console.log("Pengguna berhasil login:", data.user);
      navigate("/"); // Arahkan ke dashboard admin setelah login berhasil (atau ke rute yang sesuai)

    } catch (err) {
      console.error("Kesalahan login:", err); // Log error lengkap
      // Menampilkan pesan error yang lebih user-friendly dari Supabase Auth
      if (err.message === "Invalid login credentials") { // Pesan umum untuk kredensial tidak valid
        setError("Email atau kata sandi salah. Harap coba lagi."); // <<< DIUBAH
      } else {
        setError(err.message || "Terjadi kesalahan yang tidak diketahui saat login."); // <<< DIUBAH
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
          src="/src/assets/Guest/Logo.webp" // Ganti dengan path gambar logo
          alt="Logo"
          className="absolute top-4 left-4 w-12 h-12"
        />
        <h1 className="text-5xl font-bold text-[#00B5E2] mb-6 text-center">
  Masuk
</h1>

        <h2 className="text-2xl font-medium text-gray-500 mb-6 text-center">
          Selamat Datang Kembali 👋 {/* <<< DIUBAH */}
        </h2>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Email {/* <<< DIUBAH */}
            </label>
            <input
              type="text"
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
          <button
            type="submit"
            className="w-full bg-[#00B5E2] hover:bg-[#00A0C6] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Masuk {/* <<< DIUBAH */}
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <button
            type="button"
            onClick={() => navigate("/forgot")} // Ubah ke lowercase 'forgot' jika rute Anda '/forgot'
            className="text-blue-600 hover:underline"
          >
            Lupa Kata Sandi? {/* <<< DIUBAH */}
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")} // Ubah ke lowercase 'register' jika rute Anda '/register'
            className="text-blue-600 hover:underline"
          >
            Daftar {/* <<< DIUBAH */}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-600">
          <p>© 2025 RS. Awal Bros Pekanbaru. Hak cipta dilindungi undang-undang.</p> {/* <<< DIUBAH */}
        </footer>
      </div>
    </div>
  );
}
