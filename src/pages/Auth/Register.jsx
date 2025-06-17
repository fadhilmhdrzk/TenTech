import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

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
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    axios
      .post("https://dummyjson.com/user/register", {
        username: dataForm.username,
        email: dataForm.email,
        password: dataForm.password,
      })
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data.message);
          return;
        }
        navigate("/login");
      })
      .catch((err) => {
        setError(err.message || "An unknown error occurred");
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
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg relative"> {/* Mengubah max-w-sm menjadi max-w-md */}
        <img
          src="/src/assets/Guest/Logo.webp" // Menggunakan path gambar logo
          alt="Logo"
          className="absolute top-4 left-4 w-12 h-12"
        />
        <h1 className="text-5xl font-bold text-[var(--color-tosca-500)] mb-6 text-center">
          Register
        </h1>
        <h2 className="text-2xl font-medium text-gray-500 mb-6 text-center">
          Create Your Account ✨
        </h2>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="your_username"
              name="username"
              onChange={handleChange}
            />
          </div>

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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="********"
              name="password"
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-tosca-600)]"
              placeholder="********"
              name="confirmPassword"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-tosca-500)] hover:bg-[var(--color-tosca-600)] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Link ke Halaman Login di Pojok Kanan Atas */}
        <div className="text-sm text-center text-blue-600 hover:underline mt-4">
          <a href="/login">Already have an account? Login here</a>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-600">
          <p>© 2025 RS. Awal Bros Pekanbaru. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
