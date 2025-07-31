import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import useAuth from "../../hook/useAuth";
import { axiosSecure } from "../../hook/useAxiosSecure";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [regError, setRegError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password", "");

  const onSubmit = async (data) => {
    const { name, email, password } = data;
    setRegError("");

    try {
      // Create user in Firebase
      const result = await createUser(email, password);
      await updateUserProfile({ displayName: name });

      // Post user to MongoDB
      const userData = {
        email,
        displayName: name,
        role: "user",
      };

      await axiosSecure.post("/users", userData);
      toast.success("Registration successful!");

      // Navigate
      navigate("/");
    } catch (error) {
      setRegError(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white mx-auto mt-10"
    >
      <h1 className="text-gray-900 text-3xl font-medium mt-10">Register</h1>
      <p className="text-gray-500 text-sm mt-2">Create your account below</p>

      {/* Full Name */}
      <div className="mt-8">
        <input
          type="text"
          placeholder="Full Name"
          {...register("name", { required: "Name is required" })}
          className={`input w-full h-12 px-6 rounded-full border ${
            errors.name ? "border-red-500" : "border-gray-300/80"
          } text-sm text-gray-700`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs text-left mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="mt-4">
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className={`input w-full h-12 px-6 rounded-full border ${
            errors.email ? "border-red-500" : "border-gray-300/80"
          } text-sm text-gray-700`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs text-left mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="mt-4 relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min 6 characters" },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
              message: "Must include uppercase, number, special char",
            },
          })}
          className={`input w-full h-12 px-6 pr-12 rounded-full border ${
            errors.password ? "border-red-500" : "border-gray-300/80"
          } text-sm text-gray-700`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-3 right-4 text-gray-500"
          tabIndex={-1}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-xs text-left mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mt-4 relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className={`input w-full h-12 px-6 pr-12 rounded-full border ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300/80"
          } text-sm text-gray-700`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute top-3 right-4 text-gray-500"
          tabIndex={-1}
        >
          {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs text-left mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Error */}
      {regError && <p className="text-red-600 text-sm mt-3">{regError}</p>}

      {/* Submit */}
      <button
        type="submit"
        className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
      >
        Register
      </button>

      <p className="text-gray-500 text-sm mt-3 mb-11">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-500">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default Register;
