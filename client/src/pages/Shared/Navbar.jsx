import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* Logo */}
      <a href="https://prebuiltui.com" className="text-lg font-bold">
        LOGO
      </a>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 flex-1 justify-end">
        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-4 rounded-full flex-1 max-w-md">
          <input
            className="py-1.5 flex-1 bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          {/* Search Icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10.836 10.615L15 14.695"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Login Button */}
        <button className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
          Login
        </button>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
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
        {/* Mobile Search Bar */}
        <div className="flex items-center w-full border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 flex-1 bg-transparent outline-none placeholder-gray-500 text-sm"
            type="text"
            placeholder="Search products"
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10.836 10.615L15 14.695"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
