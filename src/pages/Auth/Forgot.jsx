import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Forgot() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({
    email: "",
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

    // Validasi email
    if (!dataForm.email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    axios
      .post("https://dummyjson.com/user/forgot", {
        email: dataForm.email,
      })
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data.message);
          return;
        }
        navigate("/login");
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message || "An error occurred");
        } else {
          setError(err.message || "An unknown error occurred");
        }
      })
      .finally(() => {
        setLoading(false);
      });
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
        <img
          src="/src/assets/Guest/Logo.webp" // Menggunakan path gambar logo
          alt="Logo"
          className="absolute top-4 left-4 w-12 h-12"
        />
        
       <h1 className="text-5xl font-bold text-[#00B5E2] mb-6 text-center">
          Forgot
        </h1>
        <h2 className="text-2xl font-medium text-gray-500 mb-6 text-center">
          Forgot Your Password?
        </h2>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="you@example.com"
              name="email"
              onChange={handleChange}
            />
          </div>
         <button
  type="submit"
  className="w-full bg-[#00B5E2] hover:bg-[#00A0C6] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
>
            Send Reset Link
          </button>
        </form>

        {/* Link ke Halaman Login */}
        <div className="mt-4 text-center text-sm text-blue-600 hover:underline">
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-600">
          <p>© 2025 RS. Awal Bros Pekanbaru. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
