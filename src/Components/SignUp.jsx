import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import loginIllustration from "../assets/Illustrasi Login.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  async function signup(e) {
    e.preventDefault();
    const { email, first_name, last_name, password, password_confirmation } =
      data;

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!first_name.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!last_name.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (password.length < 8) {
      toast.error("Password 8 karakter atau lebih");
      return;
    }
    if (password !== password_confirmation) {
      toast.error("Passwords tidak sama");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/registration",
        {
          email,
          first_name,
          last_name,
          password,
        },
      );

      if (data.status === 0) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="max-w-[80%] mx-auto">
      <div className="w-full flex flex-row">
        {/* form */}
        <div className="w-1/2 flex items-center justify-center text-center bg-whiterounded ">
          <div className="w-1/2">
            <div className="flex flex-row justify-center items-center gap-2">
              <img src={logo} alt="Logo" />
              <span className="font-bold text-2xl">SIMS PPOB</span>
            </div>
            <p className="text-2xl py-8 font-semibold ">
              Lengkapi data untuk membuat akun
            </p>
            <form onSubmit={signup}>
              <input
                onChange={(e) => setData({ ...data, email: e.target.value })}
                value={data.email}
                type="email"
                id="email"
                name="email"
                className="mt-6 p-2 w-full border rounded-md"
                placeholder="Masukkan email anda"
              />

              <input
                onChange={(e) =>
                  setData({ ...data, first_name: e.target.value })
                }
                value={data.first_name}
                type="text"
                id="first_name"
                name="first_name"
                className="mt-6 p-2 w-full border rounded-md"
                placeholder="Masukkan nama depan anda"
              />

              <input
                onChange={(e) =>
                  setData({ ...data, last_name: e.target.value })
                }
                value={data.last_name}
                type="text"
                id="last_name"
                name="last_name"
                className="mt-6 p-2 w-full border rounded-md"
                placeholder="Masukkan nama belakang anda"
              />

              <div className="relative mt-6">
                <input
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  value={data.password}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="p-2 w-full border rounded-md"
                  placeholder="Masukkan password anda"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black"
                >
                  {showPassword ? (
                    <svg
                      width="20px"
                      height="20px"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="#000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
                      />
                      <path
                        stroke="#000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12.001 5C7.524 5 3.733 7.943 2.46 12c1.274 4.057 5.065 7 9.542 7 4.478 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20px"
                      height="20px"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="#000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m2.999 3 18 18M9.843 9.914a3 3 0 0 0 4.265 4.22M6.5 6.646A10.02 10.02 0 0 0 2.457 12c1.274 4.057 5.065 7 9.542 7 1.99 0 3.842-.58 5.4-1.582m-6.4-12.369q.494-.049 1-.049c4.478 0 8.268 2.943 9.542 7a10 10 0 0 1-1.189 2.5"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="relative mt-6">
                <input
                  onChange={(e) =>
                    setData({ ...data, password_confirmation: e.target.value })
                  }
                  value={data.password_confirmation}
                  type={showPasswordConfirmation ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  className={`p-2 w-full border rounded-md ${data.password_confirmation && data.password !== data.password_confirmation ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Konfirmasi password anda"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black"
                >
                  {showPasswordConfirmation ? 
                 (
                    <svg
                      width="20px"
                      height="20px"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="#000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
                      />
                      <path
                        stroke="#000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12.001 5C7.524 5 3.733 7.943 2.46 12c1.274 4.057 5.065 7 9.542 7 4.478 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20px"
                      height="20px"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="#000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m2.999 3 18 18M9.843 9.914a3 3 0 0 0 4.265 4.22M6.5 6.646A10.02 10.02 0 0 0 2.457 12c1.274 4.057 5.065 7 9.542 7 1.99 0 3.842-.58 5.4-1.582m-6.4-12.369q.494-.049 1-.049c4.478 0 8.268 2.943 9.542 7a10 10 0 0 1-1.189 2.5"
                      />
                    </svg>
                  ) }
                </button>
              </div>

              <button
                type="submit"
                onClick={signup}
                className="w-full mt-10  bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-8 text-sm">
              Sudah punya akun? Masuk{" "}
              <a href="/login" className="text-red-500 hover:underline">
                di sini
              </a>
            </p>
          </div>
        </div>
        {/* illustration */}
        <div className="w-1/2">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="max-h-screen  "
          />
        </div>
      </div>
    </div>
  );
}
