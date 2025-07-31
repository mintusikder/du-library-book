import React from "react";
import { useForm } from "react-hook-form";

const BorrowModal = ({ isOpen, onClose, onSubmit, book }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      role: "student",
      quantity: 1,
    },
  });

  if (!isOpen || !book) return null;

  const submitHandler = (data) => {
    const formData = {
      ...data,
      book_title: book.book_title,
      author: book.author,
      publisher: book.publisher,
    };
    onSubmit(formData);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-center">Borrow Book</h2>

        <p className="text-sm text-gray-600 text-center mb-4">
          <strong>Book:</strong> {book.book_title} by {book.author}
        </p>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="input input-bordered w-full"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}

          <input
            type="tel"
            placeholder="Phone Number"
            className="input input-bordered w-full"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Invalid phone number",
              },
            })}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
          )}

          {/* Quantity Selection */}
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Quantity
            </label>
            <select
              {...register("quantity", { required: true })}
              className="select select-bordered w-full"
            >
              {[1, 2, 3, 4, 5].map((qty) => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="student"
                {...register("role")}
                defaultChecked
                className="radio"
              />
              Student
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="teacher"
                {...register("role")}
                className="radio"
              />
              Teacher
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-warning btn-sm text-white">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal;
