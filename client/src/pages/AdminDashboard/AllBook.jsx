import React, { useEffect, useState } from "react";
import { axiosSecure } from "../../hook/useAxiosSecure";
import Loading from "../Shared/Loading";
import toast from "react-hot-toast";
import BorrowModal from "../Shared/BorrowModal";

const AllBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    axiosSecure
      .get("/books")
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading books:", err);
        setLoading(false);
      });
  }, []);

  const handleView = (id) => {
    const book = books.find((b) => b._id === id);
    setSelectedBook(book);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedBook(null);
    setViewModalOpen(false);
  };

  const handleBorrowed = (id) => {
    const book = books.find((b) => b._id === id);
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      const response = await axiosSecure.post("/borrowedBooks", formData);
      console.log("Borrow response:", response.data);
      toast.success("Borrow request submitted successfully!");
      setModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Failed to submit borrow request:", error);
      toast.error("Failed to submit borrow request. Please try again.");
    }
  };

  const openDeleteFromView = (id) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
    setViewModalOpen(false);
  };

  const openDeleteModal = (id) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setBookToDelete(null);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      await axiosSecure.delete(`/books/${bookToDelete}`);
      setBooks((prev) => prev.filter((book) => book._id !== bookToDelete));
      toast.success("Book deleted successfully");
    } catch (error) {
      console.error("Failed to delete book", error);
      toast.error("Failed to delete book");
    } finally {
      setDeleteModalOpen(false);
      setBookToDelete(null);
    }
  };

  const handleUpdate = (id) => {
    const book = books.find((b) => b._id === id);
    setSelectedBook(book);
    setUpdatedBook(book);
    setUpdateModalOpen(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook((prev) => ({ ...prev, [name]: value }));
  };

  const submitUpdate = async () => {
    try {
      await axiosSecure.patch(`/books/${updatedBook._id}`, updatedBook);
      setBooks((prev) =>
        prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
      );
      toast.success("Book updated successfully");
      setUpdateModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update book");
    }
  };

  const filteredBooks = books.filter((book) =>
    book.book_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIdx, startIdx + itemsPerPage);

  if (loading) return <Loading />;

  return (
    <div className="p-5 relative">
      <h2 className="text-2xl font-semibold mb-4">All Books</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="input input-bordered w-full max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Volume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book, index) => (
              <tr key={book._id} className="hover">
                <td>{startIdx + index + 1}</td>
                <td>{book.book_title}</td>
                <td>{book.author}</td>
                <td>{book.volume}</td>
                <td className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleView(book._id)}
                    className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleBorrowed(book._id)}
                    className="btn btn-sm bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Borrowed Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BorrowModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        book={selectedBook}
      />

      <div className="flex justify-center gap-4 mt-6">
        <button
          className="btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          « Previous
        </button>
        <button
          className="btn"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Next »
        </button>
      </div>

      {/* View, Update, Delete Modals below here (not repeated for brevity) */}
    </div>
  );
};

export default AllBook;