import React, { useEffect, useState } from "react";
import { axiosSecure } from "../../hook/useAxiosSecure";
import Loading from "../Shared/Loading";
import { FaBook, FaBookReader, FaUser } from "react-icons/fa";

const AdminDashboard = () => {
  const [totalBooks, setTotalBooks] = useState(null);
  const [totalBorrowed, setTotalBorrowed] = useState(null);
  const [borrowedToday, setBorrowedToday] = useState(0);
  const [borrowedThisWeek, setBorrowedThisWeek] = useState(0);
  const [borrowedThisMonth, setBorrowedThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  // Helper function to check date ranges
  const isDateInRange = (date, start, end) => {
    const d = new Date(date);
    return d >= start && d <= end;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, borrowedRes] = await Promise.all([
          axiosSecure.get("/books"),
          axiosSecure.get("/borrowedBooks"),
        ]);
        setTotalBooks(booksRes.data.length);
        setTotalBorrowed(borrowedRes.data.length);

        // Calculate borrowed counts for different periods
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let todayCount = 0;
        let weekCount = 0;
        let monthCount = 0;

        borrowedRes.data.forEach((item) => {
          const borrowedDate = new Date(item.borrowedAt);
          if (borrowedDate >= startOfToday) todayCount++;
          if (borrowedDate >= startOfWeek) weekCount++;
          if (borrowedDate >= startOfMonth) monthCount++;
        });

        setBorrowedToday(todayCount);
        setBorrowedThisWeek(weekCount);
        setBorrowedThisMonth(monthCount);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-10 ">
      <h1 className="text-3xl font-bold text-[#C75D2C] mb-8">Welcome, Admin!</h1>
      <p className="mb-12 text-gray-700 text-lg">Manage books, borrowing, and more.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#F3E9DC] p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaBook className="text-[#C75D2C] text-4xl" />
          <div>
            <h2 className="text-xl font-semibold">Total Books</h2>
            <p className="text-3xl font-bold text-black">{totalBooks}</p>
          </div>
        </div>

        <div className=" p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaBookReader className=" text-4xl" />
          <div>
            <h2 className="text-xl font-semibold">Total Borrowed</h2>
            <p className="text-3xl font-bold text-black">{totalBorrowed}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md text-center border border-indigo-200">
          <h3 className="font-semibold mb-2">Borrowed Today</h3>
          <p className="text-2xl font-bold">{borrowedToday}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center border border-green-200">
          <h3 className="font-semibold mb-2">Borrowed This Week</h3>
          <p className="text-2xl font-bold">{borrowedThisWeek}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center border border-blue-200">
          <h3 className="font-semibold mb-2">Borrowed This Month</h3>
          <p className="text-2xl font-bold">{borrowedThisMonth}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
