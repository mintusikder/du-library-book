import { Link, NavLink, Outlet } from "react-router";
import { FaHome, FaBook, FaPlusCircle, FaList, FaBookReader } from "react-icons/fa";

import useRole from "../../hook/useRole";
import useAuth from "../../hook/useAuth";

const AdminLayout = () => {
  const { user } = useAuth();
  const { role } = useRole(user?.email);

  // Style function to highlight active nav links
  const activeClass = "text-indigo-300 font-semibold";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-600 text-white p-6 space-y-6 hidden md:block">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="space-y-3">
          {/* Back to Home */}
          <Link to="/" className="flex items-center gap-2 hover:text-indigo-200">
            <FaHome />
            Back to Home
          </Link>

          {/* Dashboard Nav Links */}
          <NavLink
            to="/dashboard/home"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-indigo-200 ${isActive ? activeClass : ""}`
            }
          >
            <FaHome />
            Dashboard Home
          </NavLink>

          <NavLink
            to="/dashboard/add-book"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-indigo-200 ${isActive ? activeClass : ""}`
            }
          >
            <FaPlusCircle />
            Add Book
          </NavLink>

          <NavLink
            to="/dashboard/all-book"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-indigo-200 ${isActive ? activeClass : ""}`
            }
          >
            <FaList />
            All Books
          </NavLink>

          <NavLink
            to="/dashboard/borrowed-book"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-indigo-200 ${isActive ? activeClass : ""}`
            }
          >
            <FaBookReader />
            Borrowed Books
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
