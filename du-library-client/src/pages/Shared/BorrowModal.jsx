import React, { useState } from "react";
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
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !book) return null;

  const submitHandler = async (data) => {
    const formData = {
      ...data,
      book_title: book.book_title,
      author: book.author,
      publisher: book.publisher,
    };

    try {
      setIsSubmitting(true);
      console.log("Sending borrow data:", formData);
      await onSubmit(formData);
      reset();
      onClose();
    } catch (err) {
      console.error("Borrow submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
          )}

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="student"
                {...register("role")}
                defaultChecked
                className="radio"
                disabled={isSubmitting}
              />
              Student
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="teacher"
                {...register("role")}
                className="radio"
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[#D96F32] btn-sm text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal;
