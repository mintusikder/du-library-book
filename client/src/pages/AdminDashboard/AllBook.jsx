import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { axiosSecure } from "../../hook/useAxiosSecure";
import Loading from "../Shared/Loading";
import toast from "react-hot-toast";

const AllBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const itemsPerPage = 10;

  // Fetch books
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

  // View book
  const handleView = (id) => {
    const book = books.find((b) => b._id === id);
    setSelectedBook(book);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedBook(null);
    setViewModalOpen(false);
  };

  // Delete modal from inside view
  const openDeleteFromView = (id) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
    setViewModalOpen(false);
  };

  // Delete modal from table
  const openDeleteModal = (id) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
  };

  // Confirm delete
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

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setBookToDelete(null);
  };

  // Update logic placeholder
  const handleUpdate = (id) => {
    console.log("Update book:", id);
    // Add your update logic or navigation here
  };

  // Placeholder for handleBorrowed
  const handleBorrowed = (id) => {
    console.log("Borrowed Book ID:", id);
    toast.success("Borrowed logic not implemented");
  };

  // Filtered + paginated
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

      {/* Search */}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Publisher</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book, index) => (
              <tr key={book._id} className="hover">
                <td>{startIdx + index + 1}</td>
                <td>{book.book_title}</td>
                <td>{book.publisher}</td>
                <td>{book.author}</td>
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

      {/* Pagination */}
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

      {/* View Modal */}
      {viewModalOpen && selectedBook && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <h3 className="text-xl font-bold mb-4 text-center">
              Book Details
            </h3>
            <div className="text-left space-y-2 text-sm">
              <p><strong>Title:</strong> {selectedBook.book_title}</p>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
              <p><strong>Category:</strong> {selectedBook.category}</p>
              <p><strong>Volume:</strong> {selectedBook.volume}</p>
              <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
              <p><strong>Price:</strong> {selectedBook.price}</p>
              <p><strong>Purchase Method:</strong> {selectedBook.purchase_method}</p>
              <p><strong>Year:</strong> {selectedBook.year}</p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => handleUpdate(selectedBook._id)}
              >
                Update
              </button>
              <button
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                onClick={() => openDeleteFromView(selectedBook._id)}
              >
                Delete
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this book?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="btn btn-outline px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error px-4 py-2 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBook;
