import React, { useEffect, useState } from "react";
import { axiosSecure } from "../../hook/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../Shared/Loading";

const BorrowedBook = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const handleReturn = async (id) => {
    try {
      await axiosSecure.delete(`/borrowedBooks/${id}`);
      toast.success("Book returned successfully");
      setBorrowedBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Return failed:", error);
      toast.error("Failed to return book");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Borrowed Books</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Quantity</th>
              <th>Borrowed At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((item, index) => (
              <tr key={item._id} className="hover">
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.role}</td>
                <td>{item.book_title}</td>
                <td>{item.author}</td>
                <td>{item.publisher}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.borrowedAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleReturn(item._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowedBook;
