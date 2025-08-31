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
  // const [viewModalOpen, setViewModalOpen] = useState(false);
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

  // const handleView = (book) => {
  //   setSelectedBook(book);
  //   setViewModalOpen(true);
  // };

  // const closeViewModal = () => {
  //   setSelectedBook(null);
  //   setViewModalOpen(false);
  // };

  const handleBorrowed = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      await axiosSecure.post("/borrowedBooks", formData);
      toast.success("Borrow request submitted successfully!");
      setModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Failed to submit borrow request:", error);
      toast.error("Failed to submit borrow request. Please try again.");
    }
  };

  const openDeleteModal = (bookId) => {
    setBookToDelete(bookId);
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

  const handleUpdate = (book) => {
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
    Object.values(book)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIdx, startIdx + itemsPerPage);

  if (loading) return <Loading />;

  return (
 <div className="bg-[#F3E9DC] rounded-2xl">
     <div className="p-5 relative">
      <h2 className="text-2xl font-semibold mb-4">All Books</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="input input-bordered w-full max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentBooks.map((book, index) => (
          <div key={book._id} className="card bg-base-100 shadow-lg border border-gray-200">
            <div className="card-body">
              <h2 className="card-title">{book.book_title}</h2>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>Category:</strong> {book.category}</p>
              <p><strong>Volume:</strong> {book.volume}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Price:</strong> {book.price}</p>
              <p><strong>Purchase Method:</strong> {book.purchase_method}</p>
              <p><strong>Year:</strong> {book.year}</p>
              <div className="card-actions justify-end mt-2 flex-wrap gap-2">
                {/* <button
                  onClick={() => handleView(book)}
                  className="btn btn-sm bg-black text-white"
                >
                  View
                </button> */}
                <button
                  onClick={() => handleBorrowed(book)}
                  className="btn btn-sm bg-[#D96F32] text-white"
                >
                  Borrow
                </button>
                <button
                  onClick={() => handleUpdate(book)}
                  className="btn btn-sm bg-[#3D74B6] text-white"
                >
                  Update
                </button>
                <button
                  onClick={() => openDeleteModal(book._id)}
                  className="btn btn-sm bg-[#E62727] text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BorrowModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        book={selectedBook}
      />

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

      {/* Update Modal */}
      {updateModalOpen && updatedBook && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <h3 className="text-xl font-bold mb-4 text-center">Update Book</h3>
            <form className="space-y-3">
              {[
                "book_title",
                "author",
                "publisher",
                "category",
                "volume",
                "isbn",
                "price",
                "purchase_method",
                "year",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={updatedBook[field] || ""}
                  onChange={handleUpdateChange}
                  placeholder={field.replace("_", " ")}
                  className="input input-bordered w-full"
                />
              ))}
            </form>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setUpdateModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-sm bg-[#3D74B6] text-white" onClick={submitUpdate}>
                Update
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
              <button onClick={cancelDelete} className="btn btn-outline px-4 py-2">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn bg-[#E62727] px-4 py-2 text-white">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
 </div>
  );
};

export default AllBook;
