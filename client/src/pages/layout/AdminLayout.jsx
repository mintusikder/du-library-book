import { Link, NavLink, Outlet } from "react-router";

import useRole from "../../hook/useRole";
import useAuth from "../../hook/useAuth";

const AdminLayout = () => {
  const { user } = useAuth();
  const { role } = useRole(user?.email);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-600 text-white p-6 space-y-4 hidden md:block">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="space-y-2">
          <NavLink to="/dashboard/home" className="block hover:text-indigo-200">Dashboard Home</NavLink>
          <NavLink to="/dashboard/add-book" className="block hover:text-indigo-200">Add Book</NavLink>
          <NavLink to="/dashboard/all-book" className="block hover:text-indigo-200">All Books</NavLink>
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
