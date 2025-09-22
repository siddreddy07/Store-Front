import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaUser, FaUserShield, FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "axios";
import UserModal from "./UserModal";
import AddNewuserModal from "./AddNewuserModal";
import { AuthContext } from "../contextApi/AuthContext";

const Userstable = () => {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [roleDropdown, setRoleDropdown] = useState(false);

  const [sortField, setSortField] = useState(""); 
  const [sortOrder, setSortOrder] = useState("All");
  const [openSortDropdown, setOpenSortDropdown] = useState(""); 
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  const roles = [
    { label: "All", icon: <FaUser /> },
    { label: "Normal", icon: <FaUser /> },
    { label: "Admin", icon: <FaUserShield /> }
  ];

  const sortOptions = ["All", "Asc", "Desc"];

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/get-allusers`,
        {
          params: {
            search,
            role: roleFilter === "All" ? undefined : roleFilter.toLowerCase(),
            sortField: sortField || undefined,
            sortOrder: sortOrder !== "All" ? sortOrder : undefined,
          },
          withCredentials: true,
        }
      );
      setUsers(res.data.users);
    } catch (err) {
      console.log("Error fetching users:", err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, sortField, sortOrder]);

  const handleSortSelect = (field, option) => {
    setSortField(field);
    setSortOrder(option);
    setOpenSortDropdown("");
  };

  return (
    <div className="p-4 bg-transparent relative">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Name, Email or Address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300"
        />

        {/* Role Filter Dropdown */}
        <div className="relative w-40">
          <div
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white cursor-pointer"
            onClick={() => setRoleDropdown(!roleDropdown)}
          >
            <div className="flex items-center gap-2">
              {roles.find((r) => r.label === roleFilter)?.icon} {roleFilter}
            </div>
            <span className={`${roleDropdown ? "rotate-180" : ""}`}>▼</span>
          </div>
          {roleDropdown && (
            <div className="absolute top-full left-0 w-full mt-1 rounded-lg bg-black/80 border border-white/20 shadow-lg z-50">
              {roles.map((r) => (
                <div
                  key={r.label}
                  onClick={() => {
                    setRoleFilter(r.label);
                    setRoleDropdown(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-500/30 cursor-pointer text-white"
                >
                  {r.icon} {r.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add User Button */}
        {user?.role === "admin" && (
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            <FaPlus /> Add User
          </button>
        )}
      </div>
          <h1 className="-mt-2 mb-2 text-orange-500">❕Click on the highlighted store owner cell to view about the store</h1>
      <div className="overflow-x-auto h-[65vh] rounded-2xl overflow-hidden relative">
        <table className="w-full bg-white/5 backdrop-blur-xl text-white text-sm sm:text-base rounded-2xl">
          <thead>
            <tr className="bg-zinc-800">
              {["name", "email", "address"].map((field) => (
                <th
                  key={field}
                  className="px-4 py-2 text-left border-b border-white/20 cursor-pointer relative"
                  onClick={() =>
                    setOpenSortDropdown(openSortDropdown === field ? "" : field)
                  }
                >
                  <div className="flex items-center justify-between">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <span className="ml-2 text-xs text-gray-300">
                      {sortField === field && sortOrder !== "All"
                        ? sortOrder
                        : ""}
                    </span>
                  </div>

                  {/* Sort Dropdown */}
                  {openSortDropdown === field && (
                    <div className="absolute z-50 top-full left-0 w-32 mt-1 rounded-lg bg-black/80 border border-white/20 shadow-lg">
                      {sortOptions.map((option) => (
                        <div
                          key={option}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSortSelect(field, option);
                          }}
                          className="px-3 py-2 hover:bg-indigo-500/30 cursor-pointer text-white"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </th>
              ))}
              <th className="px-4 py-2 text-left border-b border-white/20">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((u, i) => (
                <tr
                  key={i}
                  className="hover:bg-indigo-500/20 overflow-hidden transition cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                >
                  <td title={u.name} className="px-4 py-2 border-b border-white/20 max-w-[150px] truncate">
                    {u.name}
                  </td>
                  <td title={u.email} className="px-4 py-2 border-b border-white/20 max-w-[200px] truncate">
                    {u.email}
                  </td>
                  <td title={u.address} className="px-4 py-2 border-b border-white/20 max-w-[200px] truncate">
                    {u.address || "-"}
                  </td>
                  <td className={`px-4 py-2 rounded-br-xl border-b ${u.stores.length>0 ? 'text-indigo-400 font-semibold' : ''} border-white/20 max-w-[120px] truncate`}>
                    {u.stores.length>0 ? 'Store Owner' : u.role}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-300">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserModal user={selectedUser.stores} close={() => setSelectedUser(null)} />
      )}
      {openAddModal && (
        <AddNewuserModal close={() => setOpenAddModal(false)} />
      )}
    </div>
  );
};

export default Userstable;
