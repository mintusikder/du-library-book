import React, { useState } from "react";
import { Link } from "react-router";
import useAuth from "../../hook/useAuth";
import useRole from "../../hook/useRole";

const Navbar = () => {
  const { user, logOutUser } = useAuth();
  const { role } = useRole(user?.email);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOutUser();
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-2 border-b border-gray-300 bg-white relative">
      {/* Logo */}
      <Link to="/" className="text-lg font-bold">
        গ্রন্থাগার
      </Link>

      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-6">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <img
                src={user?.photoURL || "https://i.ibb.co/yYr1mMF/user.png"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.displayName?.split(" ")[0]}</span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2 z-50">
                {role === "admin" && (
                  <Link
                    to="/dashboard"
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
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="sm:hidden"
      >
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-4 px-5 text-sm z-50">
          {user ? (
            <>
              <p className="font-medium">{user.displayName}</p>
              {role === "admin" && (
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
