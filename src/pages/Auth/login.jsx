import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; 
import logo from '../../assets/Guest/logo.png'; // Path logo
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

    if (!dataForm.email || !dataForm.password) {
      setError("Email dan kata sandi wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: dataForm.email,
        password: dataForm.password,
      });

      if (authError) {
        throw authError;
      }

      console.log("Pengguna berhasil login:", data.user);
      navigate("/");

    } catch (err) {
      console.error("Kesalahan login:", err);
      if (err.message === "Invalid login credentials") {
        setError("Email atau kata sandi salah. Harap coba lagi.");
      } else {
        setError(err.message || "Terjadi kesalahan yang tidak diketahui saat login.");
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
        {/* Logo di pojok kiri atas */}
        <div className="absolute top-4 left-4 flex items-center space-x-4 mb-6">
          <img src={logo} alt="Logo" className="h-24 w-auto" /> {/* Ukuran logo lebih besar */}
        </div>

        <h1 className="text-5xl font-bold text-[#00B5E2] mb-6 text-center mt-1">
          Masuk
        </h1>

        <h2 className="text-2xl font-medium text-gray-500 mb-6 text-center">
          Selamat Datang Kembali 👋
        </h2>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Email
            </label>
            <input
              type="text"
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
          <button
            type="submit"
            className="w-full bg-[#00B5E2] hover:bg-[#00A0C6] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Masuk
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <button
            type="button"
            onClick={() => navigate("/forgot")}
            className="text-blue-600 hover:underline"
          >
            Lupa Kata Sandi?
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Daftar
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-600">
          <p>© 2025 RS. Awal Bros Pekanbaru. Hak cipta dilindungi undang-undang.</p>
        </footer>
      </div>
    </div>
  );
}
