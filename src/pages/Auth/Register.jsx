import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import logo from '../../assets/Guest/logo.png';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({
    username: "",
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
      setError("Semua kolom wajib diisi.");
      setLoading(false);
      return;
    }

    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Kata sandi tidak cocok.");
      setLoading(false);
      return;
    }

    if (dataForm.password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: dataForm.email,
        password: dataForm.password,
      });

      if (authError) {
        throw authError;
      }

      const user = data.user;

      if (user) {
        const { error: patientError } = await supabase
          .from('patients')
          .insert({
            auth_id: user.id,
            full_name: dataForm.username.trim(),
            email: dataForm.email.trim(),
          });

        if (patientError) {
          console.error("Kesalahan membuat entri pasien:", patientError);
          setError("Gagal membuat profil pasien. Harap coba lagi atau hubungi admin.");
          return;
        }
      } else {
        setError("Akun berhasil dibuat. Harap periksa email Anda untuk memverifikasi akun sebelum login.");
        setLoading(false);
        return;
      }

      console.log("Pengguna berhasil mendaftar dan profil pasien dibuat.");
      navigate("/login");

    } catch (err) {
      console.error("Kesalahan pendaftaran:", err);
      if (err.message.includes("User already registered")) {
        setError("Email sudah terdaftar. Harap masuk atau gunakan email lain.");
      } else {
        setError(err.message || "Terjadi kesalahan yang tidak diketahui saat mendaftar.");
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
      Mohon Tunggu...
    </div>
  ) : null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg relative">
        <div className="absolute top-4 left-4 flex items-center space-x-4 mb-6">
          <img src={logo} alt="Logo" className="h-24 w-auto" /> {/* Ukuran logo lebih besar */}
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#00B5E2]">
            Daftar
          </h1>
          <h2 className="text-2xl font-medium text-gray-500 mb-6">
            Buat Akun Anda ✨
          </h2>
        </div>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pengguna
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="nama_pengguna_anda"
              name="username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="anda@contoh.com"
              name="email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="********"
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Kata Sandi
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="********"
              name="confirmPassword"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00B5E2] hover:bg-[#00A0C6] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Daftar
          </button>
        </form>

        <div className="text-sm text-center text-blue-600 hover:underline mt-4">
          <a href="/login">Sudah punya akun? Masuk di sini</a>
        </div>

        <footer className="mt-6 text-center text-sm text-gray-600">
          <p>© 2025 RS. Awal Bros Pekanbaru. Hak cipta dilindungi undang-undang.</p>
        </footer>
      </div>
    </div>
  );
}
