import React, { useState, useContext } from "react";
import axios from "axios";
import logo from "../assets/logo.jpg";
import google from "../assets/google logo.png";
import { useNavigate } from "react-router-dom";
import { HiMiniEyeSlash } from "react-icons/hi2";
import { IoEyeSharp } from "react-icons/io5";
import { auth, provider } from "../../utils/Firebase";
import { signInWithPopup } from "firebase/auth";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";


function Registration() {
  let navigate = useNavigate();

  let { serverUrl } = useContext(authDataContext);

  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [showPassword, setShowPassword] = useState(false);
  let { getCurrentUser } = useContext(userDataContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/registration`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      getCurrentUser()
      navigate("/")
      console.log(result.data);

      // Optional: Navigate after successful registration
      // navigate("/");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const googleSignup = async () => {
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

      // Optional: Navigate after Google login
      // navigate("/");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center px-8 gap-3">
        <img
          src={logo}
          alt="One Cart Logo"
          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
        />

        <h1 className="text-3xl font-bold tracking-wide">One Cart</h1>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[400px] bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-6">
            Registration
          </h2>

          <form
            onSubmit={handleSignup}
            className="flex flex-col items-center gap-4"
          >
            {/* Google Button */}
            <div
              onClick={googleSignup}
              className="w-full h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-3 cursor-pointer hover:bg-[#42656c] transition-all duration-300"
            >
              <img
                src={google}
                alt="Google"
                className="w-6 h-6"
              />
              <span>Continue with Google</span>
            </div>

            {/* Divider */}
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-[#96969635]"></div>
              <span className="text-sm text-gray-300">OR</span>
              <div className="flex-1 h-[1px] bg-[#96969635]"></div>
            </div>

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-cyan-400"
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-cyan-400"
              required
            />

            {/* Password */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-cyan-400"
                required
              />

              {showPassword ? (
                <IoEyeSharp
                  onClick={() => setShowPassword(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-300 cursor-pointer hover:text-white"
                />
              ) : (
                <HiMiniEyeSlash
                  onClick={() => setShowPassword(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-300 cursor-pointer hover:text-white"
                />
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition duration-300 font-semibold"
            >
              Register
            </button>

            {/* Login */}
            <p className="text-sm flex gap-2">
              Already have an account?
              <span
                onClick={() => navigate("/login")}
                className="text-[#5555f6cf] font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;