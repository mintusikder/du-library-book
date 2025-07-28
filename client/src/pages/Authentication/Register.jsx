import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
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
    // 1. Create Firebase user
    const result = await createUser(email, password);
    await updateUserProfile({ displayName: name });

    // 2. Prepare user data
    const userData = {
      email,
      displayName: name,
      role: "user",  // default role
    };

    // 3. Post user data to backend with axios
    const response = await axiosSecure.post("/users", userData);

    console.log("User saved in DB:", response.data);

    // 4. Navigate after success
    navigate("/");
  } catch (error) {
    console.error("Registration error:", error.message);
    setRegError(error.message);
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-white rounded-xl shadow-md"
    >
      <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

      {/* Name */}
      <label className="block mb-1 font-semibold text-gray-700">Full Name</label>
      <input
        type="text"
        placeholder="Enter your full name"
        {...register("name", { required: "Name is required" })}
        className={`input-field ${errors.name ? "border-red-500" : "border-gray-300"}`}
      />
      {errors.name && <p className="text-red-500 text-sm mb-3">{errors.name.message}</p>}

      {/* Email */}
      <label className="block mb-1 font-semibold text-gray-700">Email Address</label>
      <input
        type="email"
        placeholder="Enter your email"
        {...register("email", { required: "Email is required" })}
        className={`input-field ${errors.email ? "border-red-500" : "border-gray-300"}`}
      />
      {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>}

      {/* Password */}
      <label className="block mb-1 font-semibold text-gray-700">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
              message: "Include uppercase, number & special character",
            },
          })}
          className={`input-field pr-10 ${errors.password ? "border-red-500" : "border-gray-300"}`}
        />
        <button
          type="button"
          className="absolute right-3 top-2 text-gray-600 hover:text-indigo-600"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {errors.password && <p className="text-red-500 text-sm mb-3">{errors.password.message}</p>}

      {/* Confirm Password */}
      <label className="block mb-1 font-semibold text-gray-700">Confirm Password</label>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className={`input-field pr-10 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
        />
        <button
          type="button"
          className="absolute right-3 top-2 text-gray-600 hover:text-indigo-600"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          tabIndex={-1}
        >
          {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm mb-4">{errors.confirmPassword.message}</p>
      )}

      {/* Register Button */}
      {regError && <p className="text-red-600 mb-3">{regError}</p>}
      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
