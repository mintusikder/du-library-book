import React, { useState } from "react";
import { Link } from "react-router"; 
import useAuth from "../../hook/useAuth";

const Navbar = () => {
  const { user, logOutUser } = useAuth(); 
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOutUser();
      // optionally show toast or redirect
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-2 border-b border-gray-300 bg-white relative transition-all">
      {/* Logo */}
      <a href="/" className="text-lg font-bold">
        গ্রন্থাগার
      </a>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 flex-1 justify-end">
        {user ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer px-8 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="sm:hidden"
      >
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-4 px-5 text-sm md:hidden`}
      >
        {user ? (
          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="cursor-pointer px-8 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
