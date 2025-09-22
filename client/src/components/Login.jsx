import React, { useState, useContext } from "react";
import { AuthContext } from "../contextApi/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "normal" });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  const { modal, setmodal,loginUser,user } = useContext(AuthContext);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });

    // Live validation
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Enter a valid email";
    }

    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
      if (!passwordRegex.test(value))
        error = "8-16 chars, 1 uppercase & 1 special character";
    }

    setErrors({ ...errors, [name]: error });
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Enter a valid email";

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(form.password))
      newErrors.password = "8-16 chars, 1 uppercase & 1 special character";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const loggedin = await loginUser(form)

    if(loggedin) {
      setForm({ 
        email: "",
        password: "",
        role: "normal",
      });

      // Wait for a tick to ensure state is updated
      setTimeout(() => {
        navigate(`/dashboard/${form.role.toLowerCase()}`);
      }, 0);
    }
}

  return (
    <div className="flex items-center justify-center min-h-screen sm:px-6 bg-transparent">
      <div className="xl:w-md sm:w-sm w-xs p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-200 mb-2">Role</label>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/30 text-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
            </button>
            {open && (
              <ul className="absolute z-10 mt-1 w-full bg-gray-800 border border-white/20 rounded-lg shadow-lg">
                {["normal", "store", "admin"].map((role) => (
                  <li
                    key={role}
                    onClick={() => {
                      setForm({ ...form, role });
                      setOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white ${
                      form.role === role ? "bg-indigo-600 text-white" : "text-gray-200"
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-4">
          Don’t have an account?{" "}
          <button onClick={() => setmodal("signup")} className="text-blue-400 hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

