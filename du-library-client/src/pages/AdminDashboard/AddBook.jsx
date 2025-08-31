import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosSecure } from "../../hook/useAxiosSecure";
import { Toaster } from "react-hot-toast";

const AddBook = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (newBook) => {
      const res = await axiosSecure.post("/books", newBook);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.insertedId) {
        toast.success("✅ Book added successfully!");
        reset();
      } else {
        toast.error("❌ Failed to add book.");
      }
    },
    onError: () => toast.error("❌ Something went wrong!"),
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="p-6 md:p-12 bg-[#F3E9DC] rounded-2xl min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-center mb-8">Add New Book</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-lg"
      >
        <input
          {...register("book_title", { required: true })}
          placeholder="Book Title*"
          className="input input-bordered w-full"
        />
        <input
          {...register("author", { required: true })}
          placeholder="Author*"
          className="input input-bordered w-full"
        />
        <input
          {...register("publisher", { required: true })}
          placeholder="Publisher*"
          className="input input-bordered w-full"
        />
        <input
          {...register("category")}
          placeholder="Category"
          className="input input-bordered w-full"
        />
        <input
          {...register("volume")}
          placeholder="Volume"
          className="input input-bordered w-full"
        />
        <input
          {...register("isbn")}
          placeholder="ISBN"
          className="input input-bordered w-full"
        />
        <input
          type="number"
          {...register("price")}
          placeholder="Price"
          className="input input-bordered w-full"
        />
        <input
          {...register("purchase_method")}
          placeholder="Purchase Method"
          className="input input-bordered w-full"
        />
        <input
          type="number"
          {...register("year")}
          placeholder="Year"
          className="input input-bordered w-full"
        />

        <button
          type="submit"
          className={`md:col-span-2 py-3 rounded-lg font-semibold text-white transition-all ${
            isLoading
              ? "bg-[#F3E9DC] cursor-not-allowed"
              : "bg-[#C75D2C] hover:bg-[#D96F32]"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "⏳ Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
