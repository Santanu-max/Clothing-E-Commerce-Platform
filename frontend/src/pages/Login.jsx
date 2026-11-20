import React, { useState, useContext } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google logo.png";
import { useNavigate } from "react-router-dom";
import { HiMiniEyeSlash } from "react-icons/hi2";
import { IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import { auth, provider } from "../../utils/Firebase";
import { signInWithPopup } from "firebase/auth";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext.jsx";

function Login() {
  let navigate = useNavigate();

  let { serverUrl } = useContext(authDataContext);

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [showPassword, setShowPassword] = useState(false);
  let { getCurrentUser } = useContext(userDataContext);

  // ================= Email Login =================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(result.data);

      await getCurrentUser();

      navigate("/");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= Google Login =================
  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);

      const user = response.user;

      const result = await axios.post(
        `${serverUrl}/api/auth/google-login`,
        {
          name: user.displayName,
          email: user.email,
        },
        {
          withCredentials: true,
        }
      );

      console.log(result.data);

      await getCurrentUser();
      navigate("/");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white flex flex-col">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center px-4 sm:px-8 gap-3">
        <img
          src={logo}
          alt="One Cart Logo"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-teal-300/40 shadow-lg"
        />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">One Cart</h1>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-[400px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full opacity-80" />

          <span className="block text-center text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70 mb-2">Welcome Back</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Login</h2>

          <form onSubmit={handleLogin} className="flex flex-col items-center gap-4">
            {/* Google Login */}
            <button
              type="button"
              onClick={googleLogin}
              className="w-full h-[50px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 cursor-pointer hover:border-teal-300/40 hover:bg-white/10 transition-all duration-300"
            >
              <img src={google} alt="Google" className="w-5 h-5" />
              <span className="text-sm sm:text-base">Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-white/10"></div>
              <span className="text-xs text-slate-400 tracking-wide">OR</span>
              <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm sm:text-base outline-none focus:border-teal-300/50 transition-colors placeholder:text-slate-400"
              required
            />

            {/* Password */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-sm sm:text-base outline-none focus:border-teal-300/50 transition-colors placeholder:text-slate-400"
                required
              />

              {showPassword ? (
                <IoEyeSharp
                  onClick={() => setShowPassword(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 cursor-pointer hover:text-teal-300 transition-colors"
                />
              ) : (
                <HiMiniEyeSlash
                  onClick={() => setShowPassword(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 cursor-pointer hover:text-teal-300 transition-colors"
                />
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full p-3 rounded-full border border-teal-400/40 text-teal-100 font-semibold tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300"
            >
              Login
            </button>

            {/* Register */}
            <p className="text-sm text-slate-300 flex gap-2">
              Don't have an account?
              <span
                onClick={() => navigate("/signup")}
                className="text-teal-300 font-semibold cursor-pointer hover:underline"
              >
                Create New Account
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
