import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { setUser, fetchProfile } from "../features/userSlice";
import loginIllustration from "../assets/Illustrasi Login.png";
import logo from "../assets/Logo.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  async function login(e) {
    e.preventDefault();
    const { email, password } = data;

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "bottom-left",
        className: "bg-red-500 text-white w-full",
      });
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required", {
        position: "bottom-left",
        className: "bg-red-500 text-white w-full",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/login",
        {
          email,
          password,
        },
      );

      if (response.data.status === 0) {
        const token = response.data.data.token;
        dispatch(loginSuccess(token));

        await dispatch(fetchProfile(token)).unwrap();

        toast.success(response.data.message, {
          position: "bottom-left",
          className: "bg-green-500 text-white w-full",
        });
        navigate("/");
      } else {
        toast.error(error.response.data.message, {
        position: "bottom-left",
        className: "bg-red-500 text-white w-full",
      });
      }
    } catch (error) {
      setIsError(true);
      toast.error(error.response.data.message, {
        position: "bottom-left",
        className: "bg-red-500 text-white w-full",
      });
    }
  }

  return (
    <div className="max-w-[80%] mx-auto">
      <div className="w-full flex flex-row ">
        {/* form */}

        <div className="w-1/2  flex flex-col items-center justify-center text-center ">
          <div className="w-1/2 ">
            <div className="flex flex-row justify-center items-center gap-2">
              <img src={logo} alt="Logo" />
              <span className="font-bold text-2xl">SIMS PPOB</span>
            </div>
            <h2 className="text-2xl py-8 font-semibold">
              Masuk atau membuat akun <br /> untuk memulai
            </h2>

            <form className="w-full" onSubmit={login}>
              <input
                onChange={(e) => setData({ ...data, email: e.target.value })}
                value={data.email}
                type="email"
                id="email"
                name="email"
                placeholder="Masukkan email anda"
                className="mt-1 p-2 w-full border rounded-md"
              />

              <div className="relative mt-8">
                <input
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  value={data.password}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Masukkan password anda"
                  className={`p-2 w-full border rounded-md ${isError && "border-red-500"}`}
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

              <button
                type="submit"
                onClick={login}
                className="mt-12 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Log In
              </button>
            </form>
          </div>

          <p className="mt-8 text-sm">
            Belum punya akun? Registrasi{" "}
            <a href="/register" className="text-red-500 hover:underline">
              di sini
            </a>
          </p>
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
