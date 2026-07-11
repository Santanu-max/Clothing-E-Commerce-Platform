import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { IoSearchCircleOutline, IoSearchCircle } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { PiShoppingCartBold } from "react-icons/pi";
import {
  AiOutlineHome,
  AiOutlineTag,
  AiOutlineInfoCircle,
  AiOutlineMail,
} from "react-icons/ai";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: AiOutlineHome },
  { to: "/deals", label: "Deals", icon: AiOutlineTag },
  { to: "/about", label: "About", icon: AiOutlineInfoCircle },
  { to: "/contact", label: "Contact", icon: AiOutlineMail },
];

function Nav() {
  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const cartItemCount = 0;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subtle shadow/blur boost once user scrolls
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Autofocus search input when it opens
  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
      setShowSearch(false);
    }
  }

  const desktopLinkClass = ({ isActive }) =>
    `text-[14px] font-semibold tracking-wide cursor-pointer py-[10px] px-[22px] rounded-full transition-all duration-300 ${
      isActive
        ? "bg-black text-white shadow-md shadow-black/30"
        : "bg-black/5 text-black hover:bg-black hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-[2px] flex-1 py-[6px] transition-colors duration-200 ${
      isActive ? "text-teal-600" : "text-gray-500"
    }`;

  return (
    <>
      {/* Top Navbar */}
      <div
        className={`fixed top-0 left-0 w-full h-[70px] z-30 flex items-center justify-between px-[18px] sm:px-[30px] backdrop-blur-md transition-shadow duration-300 ${
          scrolled
            ? "bg-white/80 shadow-lg shadow-black/10"
            : "bg-white/60 shadow-sm"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-start gap-[10px] flex-shrink-0">
          <img
            src={logo}
            alt="One Cart logo"
            className="w-[32px] h-[32px] rounded-full object-cover ring-2 ring-black/10"
          />
          <Link
            to="/"
            className="text-[22px] sm:text-[24px] font-bold tracking-tight bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent"
          >
            One Cart
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex items-center justify-center gap-[12px]">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"} className={desktopLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side */}
        <div
          className="flex items-center justify-end relative flex-shrink-0"
          ref={profileRef}
        >
          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showSearch ? "w-[160px] sm:w-[280px] mr-2 sm:mr-3" : "w-0"
            }`}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full h-[40px] rounded-full border border-gray-300 bg-white/90 px-4 text-[14px] outline-none shadow-inner focus:ring-2 focus:ring-teal-400 transition-all"
            />
          </form>

          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label={showSearch ? "Close search" : "Open search"}
            className="flex-shrink-0 text-black/80 hover:text-black transition-transform duration-200 hover:scale-110"
          >
            {!showSearch ? (
              <IoSearchCircleOutline className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px]" />
            ) : (
              <IoSearchCircle className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px]" />
            )}
          </button>

          {/* User avatar */}
          <button
            type="button"
            onClick={() => setShowProfile((prev) => !prev)}
            aria-label="Open account menu"
            className="ml-3 sm:ml-4 flex-shrink-0 transition-transform duration-200 hover:scale-110"
          >
            {!userData ? (
              <FaUserCircle className="text-black/80 w-[27px] h-[27px]" />
            ) : (
              <div className="w-[30px] h-[30px] bg-gradient-to-br from-teal-500 to-black text-white rounded-full flex items-center justify-center font-semibold shadow-md">
                {userData?.name ? userData.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </button>

          {/* Cart — hidden on mobile since it's in the bottom bar */}
          <div
            className="relative ml-4 hidden md:block flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-110"
            onClick={() => navigate("/cart")}
            role="button"
            tabIndex={0}
            aria-label="View cart"
          >
            <PiShoppingCartBold className="text-black/80 w-[28px] h-[28px]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </div>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute top-[130%] right-0 w-[210px] bg-white border border-black/10 rounded-[14px] shadow-2xl shadow-black/20 z-50 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
              <ul className="w-full flex flex-col py-1 text-black">
                {!userData ? (
                  <>
                    <li
                      className="w-full py-3 px-4 hover:bg-gray-100 cursor-pointer text-[14px] font-medium transition-colors"
                      onClick={() => {
                        navigate("/login");
                        setShowProfile(false);
                      }}
                    >
                      Login
                    </li>
                    <li
                      className="w-full py-3 px-4 hover:bg-gray-100 cursor-pointer text-[14px] font-medium transition-colors"
                      onClick={() => {
                        navigate("/signup");
                        setShowProfile(false);
                      }}
                    >
                      Signup
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className="w-full py-3 px-4 hover:bg-gray-100 cursor-pointer text-[14px] font-medium transition-colors"
                      onClick={() => {
                        navigate("/orders");
                        setShowProfile(false);
                      }}
                    >
                      Orders
                    </li>
                    <li
                      className="w-full py-3 px-4 hover:bg-gray-100 cursor-pointer text-[14px] font-medium transition-colors"
                      onClick={() => {
                        navigate("/profile");
                        setShowProfile(false);
                      }}
                    >
                      Profile
                    </li>
                    <li
                      className="w-full py-3 px-4 hover:bg-red-50 hover:text-red-600 cursor-pointer text-[14px] font-medium transition-colors"
                      onClick={() => {
                        handleLogout();
                        setShowProfile(false);
                      }}
                    >
                      Logout
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Bottom Nav (acts like a footer nav) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-[62px] z-30 bg-white/95 backdrop-blur-md border-t border-black/10 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] flex items-stretch">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={mobileLinkClass}>
            <Icon className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
        <div
          className="flex flex-col items-center justify-center gap-[2px] flex-1 py-[6px] text-gray-500 cursor-pointer"
          onClick={() => navigate("/cart")}
          role="button"
          tabIndex={0}
          aria-label="View cart"
        >
          <div className="relative">
            <PiShoppingCartBold className="w-[22px] h-[22px]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </div>
      </div>
    </>
  );
}

export default Nav;