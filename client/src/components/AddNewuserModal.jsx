import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../contextApi/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddNewUserModal({close}) {
  const { registerUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "normal",
  });

  const [errors, setErrors] = useState({});
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });

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

    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/add-new-user`,form,{withCredentials:true});

    if (res.data.success) {
      toast(res.data.message || "New User Registration successful!", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      setForm({ name: "", email: "", address: "", password: "", role: "normal" });
      close()
      
    }

    else{
      toast(res.data.message || "Unable to Add New User", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="xl:w-md mt-4 lg:mt-10 sm:w-sm w-xs mb-14 p-4 sm:p-5 md:p-6 rounded-2xl backdrop-blur-xl bg-zinc-800 border border-white/20 shadow-2xl">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-4 sm:mb-5">
          Create New User
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
              className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-200 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Address"
              className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows={2}
              maxLength={400}
            />
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
              className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          {/* Custom Role Dropdown */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-200 mb-1">
              Role
            </label>
            <div
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/30 text-white cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
              <span className={`${roleDropdownOpen ? "rotate-180" : ""} transition`}>▼</span>
            </div>

            {roleDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-1 rounded-lg bg-zinc-700 border border-white/20 z-10">
                {["normal", "admin"].map((role) => (
                  <div
                    key={role}
                    onClick={() => {
                      setForm({ ...form, role });
                      setRoleDropdownOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-indigo-500/30 cursor-pointer text-white"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

                <div className="flex items-center gap-4">
          <button
          onClick={()=>close()}
            type="submit"
            className="w-full py-2 rounded-lg bg-zinc-500 hover:bg-zinc-600 text-white font-semibold shadow-md transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-md transition duration-300"
          >
            Add New User
          </button>

                </div>
        </form>
      </div>
    </div>
  );
}
