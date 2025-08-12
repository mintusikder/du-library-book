import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router"; 
import useAuth from "../../hook/useAuth";
import useRole from "../../hook/useRole";

const Navbar = () => {
  const { user, logOutUser } = useAuth();
  const { role } = useRole(user?.email);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logOutUser();
      setDropdownOpen(false);
      setOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 py-2 border-b border-gray-300 bg-white relative">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold">
          গ্রন্থাগার
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <img
                  src={user?.photoURL || "https://i.ibb.co/M5B9HYT0/profile.png"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{user.displayName?.split(" ")[0]}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2 z-50">
                  {role === "admin" && (
                    <Link
                      to="/dashboard/home"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-black transition text-white rounded-full"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Toggle menu"
          className="sm:hidden z-50"
        >
          <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
          </svg>
        </button>
      </nav>

      {/* Sidebar Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"></div>
      )}

      {/* Sidebar */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col gap-6">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="self-end text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>

          {user ? (
            <>
              {/* Profile Info */}
              <div className="flex items-center gap-3 border-b pb-3">
                <img
                  src={user?.photoURL || "https://i.ibb.co/M5B9HYT0/profile.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="font-medium">{user.displayName}</p>
              </div>

              {/* Links */}
              {role === "admin" && (
                <Link
                  to="/dashboard/home"
                  onClick={() => setOpen(false)}
                  className="hover:text-indigo-500"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-left hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="hover:text-indigo-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
