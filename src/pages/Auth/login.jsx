import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      setError("Username and password required");
      setLoading(false);
      return;
    }

    axios
      .post("https://dummyjson.com/user/login", {
        username: dataForm.email,
        password: dataForm.password,
      })
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data.message);
          return;
        }
        // Redirect to dashboard if login is successful
        navigate("/");
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
          src="/src/assets/Guest/Logo.webp" // Ganti dengan path gambar logo
          alt="Logo"
          className="absolute top-4 left-4 w-12 h-12" // Menempatkan gambar di kiri atas
        />
        {/* Sedap Title with Bold Text */}
        <h1 className="text-5xl font-bold text-[var(--color-tosca-500)] mb-6 text-center">
          Login
        </h1>

        {/* Welcome Back with lighter text */}
        <h2 className="text-2xl font-medium text-gray-500 mb-6 text-center">
          Welcome Back 👋
        </h2>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="text"
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
          <button
            type="submit"
            className="w-full bg-[var(--color-tosca-500)] hover:bg-[var(--color-tosca-600)] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <button
            type="button"
            onClick={() => navigate("/Forgot")}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => navigate("/Register")}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </div>

        {/* Footer with RS. Awal Bros Pekanbaru */}
        <footer className="mt-6 text-center text-sm text-gray-600">
          <p>© 2025 RS. Awal Bros Pekanbaru. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
