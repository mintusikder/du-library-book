import React, { useState } from "react";

import { Link, NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaPlusCircle,
  FaList,
  FaBookReader,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import useRole from "../../hook/useRole";
import useAuth from "../../hook/useAuth";

const AdminLayout = () => {
  const { user } = useAuth();
  const { role } = useRole(user?.email);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeClass = "text-indigo-300 font-semibold";

  const navLinks = (
    <>
      <Link
        to="/"
        className="flex items-center gap-2 hover:text-indigo-200 transition duration-200"
        onClick={() => setSidebarOpen(false)}
      >
        <FaHome />
        Back to Home
      </Link>

      <NavLink
        to="/dashboard/home"
        className={({ isActive }) =>
          `flex items-center gap-2 hover:text-indigo-200 transition duration-200 ${
            isActive ? activeClass : ""
          }`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <FaHome />
        Dashboard Home
      </NavLink>

      <NavLink
        to="/dashboard/add-book"
        className={({ isActive }) =>
          `flex items-center gap-2 hover:text-indigo-200 transition duration-200 ${
            isActive ? activeClass : ""
          }`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <FaPlusCircle />
        Add Book
      </NavLink>

      <NavLink
        to="/dashboard/all-book"
        className={({ isActive }) =>
          `flex items-center gap-2 hover:text-indigo-200 transition duration-200 ${
            isActive ? activeClass : ""
          }`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <FaList />
        All Books
      </NavLink>

      <NavLink
        to="/dashboard/borrowed-book"
        className={({ isActive }) =>
          `flex items-center gap-2 hover:text-indigo-200 transition duration-200 ${
            isActive ? activeClass : ""
          }`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <FaBookReader />
        Borrowed Books
      </NavLink>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="bg-black text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2">
            <img
              src={user?.photoURL || "https://i.ibb.co/M5B9HYT0/profile.png"}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{user.displayName?.split(" ")[0]}</span>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white  text-black p-6 space-y-6 hidden md:block">
          <nav className="space-y-3">{navLinks}</nav>
        </aside>

        {/* Mobile Sidebar with Animation */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
            sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0  bg-opacity-40 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar Drawer */}
          <div
            className={`absolute top-0 left-0 w-64 h-full bg-gray-600 text-white p-6 space-y-6 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                className="text-white text-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Animated Nav Links */}
            <nav className="space-y-3">
              {React.Children.map(navLinks.props.children, (link, i) => (
                <div
                  style={{
                    animation: sidebarOpen
                      ? `fadeIn 0.3s ease ${i * 0.05 + 0.1}s forwards`
                      : "none",
                    opacity: 0,
                  }}
                  className="animate-fade"
                >
                  {link}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
