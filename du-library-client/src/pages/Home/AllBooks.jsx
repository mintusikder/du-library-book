import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../hook/useAxiosSecure";
import Loading from "../Shared/Loading";

// Updated to use axiosSecure
const fetchBooks = async () => {
  const res = await axiosSecure.get("/books");
  return res.data;
};

const AllBooks = () => {
  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredBooks = useMemo(() => {
    if (!searchTerm) return books;
    const term = searchTerm.toLowerCase();
    return books.filter((book) => {
      return (
        (typeof book.book_title === "string" &&
          book.book_title.toLowerCase().includes(term)) ||
        (typeof book.author === "string" &&
          book.author.toLowerCase().includes(term)) ||
        (typeof book.publisher === "string" &&
          book.publisher.toLowerCase().includes(term)) ||
        (typeof book.category === "string" &&
          book.category.toLowerCase().includes(term))
      );
    });
  }, [books, searchTerm]);

  const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredBooks.slice(start, start + rowsPerPage);
  }, [filteredBooks, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Books</h1>

      <input
        type="text"
        placeholder="Search by Title, Author, Publisher or Category"
        className="input input-bordered w-full max-w-md mb-4"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {isLoading ? (
        <Loading></Loading>
      ) : isError ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Category</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  paginatedBooks.map((book, index) => (
                    <tr key={book._id} className="hover:bg-base-200">
                      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td>{book.book_title}</td>
                      <td>{book.author}</td>
                      <td>{book.publisher}</td>
                      <td>{book.category}</td>
                      <td>{book.volume}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
        </>
      )}
    </div>
  );
};

export default AllBooks;
