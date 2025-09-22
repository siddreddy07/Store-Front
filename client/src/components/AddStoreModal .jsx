import React, { useContext, useState } from "react";
import { StoreContext } from "../contextApi/StoreContext";

const AddStoreModal = ({ close }) => {
  const { addnewStore } = useContext(StoreContext);

  const [form, setForm] = useState({
    storeName: "",
    storeEmail: "",
    storeAddress: "",
    ownerEmail: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  // --- validate one field at a time ---
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "storeName":
        if (value.length < 20 || value.length > 60) {
          error = "Name must be 20–60 characters long";
        }
        break;

      case "storeAddress":
        if (value.length > 400) {
          error = "Address cannot exceed 400 characters";
        }
        break;

      case "password":
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
        if (!passwordRegex.test(value)) {
          error =
            "Password must be 8–16 chars, include one uppercase & one special char";
        }
        break;

      case "storeEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Enter a valid store email";
        }
        break;

      case "ownerEmail":
        const emailRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim() !== "" && !emailRegex2.test(value)) {
          error = "Enter a valid owner email (or leave empty)";
        }
        break;

      default:
        break;
    }

    // update errors only for that field
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle input change + validate immediately
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    validateField(name, value); // run live validation
  };

  const validateAll = () => {
    let valid = true;
    Object.keys(form).forEach((field) => {
      validateField(field, form[field]);
      if (errors[field]) valid = false;
    });
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    const isadded = await addnewStore({
      name: form.storeName,
      email: form.storeEmail,
      address: form.storeAddress,
      owneremail: form.ownerEmail || null, // optional field
      password: form.password
    });

    if (isadded) {
      setForm({
        storeName: "",
        storeEmail: "",
        storeAddress: "",
        ownerEmail: "",
        password: ""
      });
      setErrors({});
      close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-800 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4 text-center">Add New Store</h2>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* Store Name */}
          <input
            type="text"
            name="storeName"
            placeholder="Store Name"
            value={form.storeName}
            onChange={handleChange}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none"
            required
          />
          {errors.storeName && (
            <p className="text-red-400 text-xs">{errors.storeName}</p>
          )}

          <input
            type="email"
            name="storeEmail"
            placeholder="Store Email"
            value={form.storeEmail}
            onChange={handleChange}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none"
            required
          />
          {errors.storeEmail && (
            <p className="text-red-400 text-xs">{errors.storeEmail}</p>
          )}

          {/* Store Address */}
          <input
            type="text"
            name="storeAddress"
            placeholder="Store Address"
            value={form.storeAddress}
            onChange={handleChange}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none"
            required
          />
          {errors.storeAddress && (
            <p className="text-red-400 text-xs">{errors.storeAddress}</p>
          )}

          {/* Owner Email (optional) */}
          <input
            type="email"
            name="ownerEmail"
            placeholder="Owner Email (optional)"
            value={form.ownerEmail}
            onChange={handleChange}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none"
          />
          {errors.ownerEmail && (
            <p className="text-red-400 text-xs">{errors.ownerEmail}</p>
          )}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none"
            required
          />
          {errors.password && (
            <p className="text-red-400 text-xs">{errors.password}</p>
          )}

          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Add Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
