import React, { useState, useContext } from "react";
import { AuthContext } from "../contextApi/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const { modal, setmodal,registerUser } = useContext(AuthContext);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });

    // Live validation
    let error = "";

    if (name === "name") {
      if (value.length < 20 || value.length > 60) error = "Name must be 20-60 characters";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Enter a valid email";
    }

    if (name === "address") {
      if (value.length > 400) error = "Address cannot exceed 400 characters";
    }

    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
      if (!passwordRegex.test(value))
        error = "Password must be 8-16 chars, 1 uppercase & 1 special char";
    }

    if (name === "confirmPassword") {
      if (value !== form.password) error = "Passwords do not match";
    }

    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const newErrors = {};
    if (form.name.length < 20 || form.name.length > 60)
      newErrors.name = "Name must be 20-60 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Enter a valid email";

    if (form.address.length > 400) newErrors.address = "Address cannot exceed 400 characters";

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(form.password))
      newErrors.password = "Password must be 8-16 chars, 1 uppercase & 1 special char";

    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const signup = await registerUser(form)
    if(signup) {
      setForm({ name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-transparent">
      <div className="xl:w-md sm:w-sm w-xs mb-14 p-4 sm:p-5 md:p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-4 sm:mb-5">
          Create Your Account
        </h2>

        <form className="space-y-2 sm:space-y-3 md:space-y-4" onSubmit={handleSubmit}>
         
          <div>
            <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Full Name"
              className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email"
              className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>
          

<div>
  <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-200 mb-1">
    Address
  </label>
  <textarea
    name="address"
    value={form.address}
    onChange={(e) => handleChange("address", e.target.value)}
    placeholder="Address"
    className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm sm:text-base"
    rows={2}
    maxLength={400}
  ></textarea>
  <div className="flex justify-between">
    {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}
    <p className="text-gray-400 text-xs">{form.address.length}/400</p>
  </div>
</div>


          {/* Password */}
          <div>
            <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Password"
              className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-200 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 sm:py-2.5 md:py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-md transition duration-300 text-sm sm:text-base"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-300 text-xs sm:text-sm mt-3 sm:mt-4">
          Already have an account?{" "}
          <button onClick={() => setmodal("login")} className="text-blue-400 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
