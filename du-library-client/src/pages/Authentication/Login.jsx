import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";
import useAuth from "../../hook/useAuth";

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoginError("");

    try {
      await loginUser(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      setLoginError(error.message || "Failed to login");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white mx-auto mt-10"
    >
      <h1 className="text-gray-900 text-3xl font-medium mt-10">Login</h1>
      <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>

      {/* Email input */}
      <div
        className={`flex items-center w-full mt-10 bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 ${
          errors.email ? "border-red-500" : "border-gray-300/80"
        }`}
      >
        <svg
          width="16"
          height="11"
          viewBox="0 0 16 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
            fill="#6B7280"
          />
        </svg>
        <input
          type="email"
          placeholder="Email id"
          className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
      </div>
      {errors.email && (
        <p className="text-red-500 text-xs text-left mt-1">{errors.email.message}</p>
      )}

      {/* Password input with eye toggle */}
      <div
        className={`flex items-center mt-4 w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 pr-4 ${
          errors.password ? "border-red-500" : "border-gray-300/80"
        }`}
      >
        <svg
          width="13"
          height="17"
          viewBox="0 0 13 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
            fill="#6B7280"
          />
        </svg>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-gray-500"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-500 text-xs text-left mt-1">{errors.password.message}</p>
      )}

      {/* Login error */}
      {loginError && <p className="text-red-600 mt-2">{loginError}</p>}

      <div className="mt-5 text-left text-black">
        <a className="text-sm" href="#">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="mt-2 w-full h-11 rounded-full text-white bg-black hover:opacity-90 transition-opacity"
      >
        Login
      </button>

      <p className="text-gray-500 text-sm mt-3 mb-11">
        Don’t have an account?{" "}
        <Link to={"/register"} className="text-black">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;
