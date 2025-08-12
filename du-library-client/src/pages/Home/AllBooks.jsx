import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../hook/useAxiosSecure";
import Loading from "../Shared/Loading";

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
  const rowsPerPage = 8; // cards per page

  const filteredBooks = useMemo(() => {
    if (!searchTerm) return books;
    const term = searchTerm.toLowerCase();
    return books.filter((book) =>
      ["book_title", "author", "publisher", "category"].some(
        (key) =>
          typeof book[key] === "string" &&
          book[key].toLowerCase().includes(term)
      )
    );
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
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Books</h1>

      <input
        type="text"
        placeholder="Search by Title, Author, Publisher or Category"
        className="input input-bordered w-full max-w-md mb-6"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <>
          {paginatedBooks.length === 0 ? (
            <p className="text-center text-gray-500">No books found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedBooks.map((book, index) => (
                <div
                  key={book._id}
                  className="bg-base-200 shadow-lg rounded-lg p-4 hover:shadow-xl transition"
                >
                  <h2 className="font-bold text-lg mb-2">{book.book_title}</h2>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Author:</span> {book.author}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Publisher:</span>{" "}
                    {book.publisher}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Category:</span>{" "}
                    {book.category}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Volume:</span> {book.volume}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">ISBN:</span> {book.isbn}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Price:</span> {book.price}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Purchase Method:</span>{" "}
                    {book.purchase_method}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Year:</span> {book.year}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllBooks;
