import React, { useEffect, useState } from "react";
import { axiosSecure } from "../../hook/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../Shared/Loading";
import ReturnModal from "../Shared/ReturnModal"; // <-- import

const BorrowedBook = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Modal State
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [bookToReturn, setBookToReturn] = useState(null);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterRole, borrowedBooks]);

  const fetchBorrowedBooks = async () => {
    try {
      const res = await axiosSecure.get("/borrowedBooks");
      setBorrowedBooks(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      toast.error("Failed to load borrowed books");
    }
  };

const applyFilters = () => {
  let filtered = [...borrowedBooks];

  // Role Filter
  if (filterRole !== "all") {
    filtered = filtered.filter((item) => item.role === filterRole);
  }

  // Search Filter
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.phone.toLowerCase().includes(lower) ||
        item.book_title.toLowerCase().includes(lower) ||
        item.author.toLowerCase().includes(lower) ||
        item.publisher.toLowerCase().includes(lower)
    );
  }

  setFilteredBooks(filtered);
};

  const openReturnModal = (book) => {
    setBookToReturn(book);
    setReturnModalOpen(true);
  };

  const closeReturnModal = () => {
    setBookToReturn(null);
    setReturnModalOpen(false);
  };

  const confirmReturn = async () => {
    try {
      await axiosSecure.delete(`/borrowedBooks/${bookToReturn._id}`);
      toast.success("Book returned successfully");
      setBorrowedBooks((prev) =>
        prev.filter((book) => book._id !== bookToReturn._id)
      );
    } catch (error) {
      console.error("Return failed:", error);
      toast.error("Failed to return book");
    } finally {
      closeReturnModal();
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Borrowed Books</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-80"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="select select-bordered w-full md:w-60"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Borrowed At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((item, index) => (
                <tr key={item._id} className="hover">
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.role}</td>
                  <td>{item.book_title}</td>
                  <td>{item.author}</td>
                  <td>{item.publisher}</td>
                  <td>{new Date(item.borrowedAt).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => openReturnModal(item)}
                      className="btn btn-sm btn-error text-white"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-gray-500 py-6">
                  No borrowed books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Return Modal */}
      <ReturnModal
        isOpen={returnModalOpen}
        onClose={closeReturnModal}
        onConfirm={confirmReturn}
        bookTitle={bookToReturn?.book_title}
      />
    </div>
  );
};

export default BorrowedBook;
