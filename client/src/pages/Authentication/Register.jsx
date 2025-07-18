import React from "react";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your register logic here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white mx-auto mt-10"
    >
      <h1 className="text-gray-900 text-3xl font-medium mt-10">Register</h1>
      <p className="text-gray-500 text-sm mt-2">Create your account to get started</p>

      <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
          required
        />
      </div>

      <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
          required
        />
      </div>

      <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
          required
        />
      </div>

      <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
      >
        Register
      </button>

      <p className="text-gray-500 text-sm mt-3 mb-11">
        Already have an account?{" "}
        <a className="text-indigo-500" href="#">
          Login
        </a>
      </p>
    </form>
  );
};

export default Register;
