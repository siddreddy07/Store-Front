import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import axios from "axios";
import AddStoreModal from "./AddStoreModal ";
import { AuthContext } from "../contextApi/AuthContext";
import { StoreContext } from "../contextApi/StoreContext";
import toast from "react-hot-toast";

const SORT_OPTIONS = ["All", "Asc", "Desc"];

const getColumns = (role) => [
  { field: "name", label: "Name" },
  ...(role === "admin" ? [{ field: "email", label: "Email" }] : []),
  { field: "address", label: "Address" },
  { field: "rating", label: "Average Rating" },
  ...(role === "normal" ? [{ field: "userRating", label: "Your Rating" }] : []),
];

const StoreTable = () => {
  const { user } = useContext(AuthContext);
  const { fetchstores } = useContext(StoreContext);

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [tempRating, setTempRating] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("All");
  const [openSortDropdown, setOpenSortDropdown] = useState("");

  const role = user?.role;
  const userId = user?.id;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchstores(debouncedSearch, sortField, sortOrder);
        setStores(data || []);
        
        const initialRatings = {};
        data?.forEach((store) => {
          if (store.userRating) {
            initialRatings[store.id] = store.userRating;
          }
        });
        setUserRatings(initialRatings === null ? 0 : initialRatings);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };
    fetchData();
  }, [debouncedSearch, sortField, sortOrder]);

  const startEditing = (storeId) => {
    setEditingStore(storeId);
    setTempRating(userRatings[storeId] || 0);
  };

  const saveRating = async (storeId) => {
    try {
      console.log(storeId)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/store/edit-rating`,
        { storeId, rating: tempRating },
        {
         withCredentials:true
        }
      );

      const { success, message, overallRating } = response.data;
      

      if (!success) {
        console.error("Failed to save rating:", message);
        return;
      }
      toast(response.data.message || "Rating successfull", {
        icon: "⭐",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      setUserRatings((prev) => ({ ...prev, [storeId]: tempRating }));
      
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === storeId
            ? { ...store, overallRating }
            : store
        )
      );
         

      setEditingStore(null);
      setTempRating(null);
    } catch (error) {
      console.error("Error saving rating:", error.response?.data?.message || error.message);
    }
  };

  const cancelEdit = () => {
    setEditingStore(null);
    setTempRating(null);
  };

  const handleSortSelect = (field, option) => {
    setSortField(field);
    setSortOrder(option);
    setOpenSortDropdown("");
  };

  const renderStars = (storeId, rating, isEditable = false) => (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          onClick={isEditable ? () => setTempRating(star) : undefined}
          className={`cursor-${isEditable ? "pointer" : "default"} ${
            star <= rating ? "text-yellow-400" : "text-gray-500"
          }`}
        />
      ))}
      {isEditable && (
        <>
          <button
            onClick={() => saveRating(storeId)}
            className="px-2 py-1 bg-green-600 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={cancelEdit}
            className="px-2 py-1 bg-red-600 text-white rounded"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 bg-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder={
            role === "admin"
              ? "Search by Name, Email or Address"
              : "Search by Name or Address"
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-300"
        />
        {role === "admin" && (
          <button
            onClick={() => setAddStoreOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            <FaPlus /> Add Store
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl h-[68vh] scrollable-table">
        <table className="w-full bg-white/10 backdrop-blur-xl text-white text-sm sm:text-base rounded-2xl">
          <thead>
            <tr className="bg-zinc-800 sticky top-0">
              {getColumns(role).map(({ field, label }) => (
                <th
                  key={field}
                  className="px-4 py-2 text-left border-b border-white/20 cursor-pointer relative"
                  onClick={
          field === "rating" || field === "userRating"
            ? undefined
            : () =>
                setOpenSortDropdown(
                  openSortDropdown === field ? "" : field
                )
        }
                >
                  <div className="flex items-center justify-between">
                    {label}
                    {field !== 'rating' && field != 'userRating' && (
                    <span className="ml-2 text-xs text-gray-300">
                      {sortField === field && sortOrder !== "All"
                        ? sortOrder
                        : "All"}
                    </span>
                    ) }
                  </div>
                  {openSortDropdown === field && (
                    <div className="absolute z-50 top-full left-0 w-32 mt-1 rounded-lg bg-black/80 border border-white/20 shadow-lg">
                      {SORT_OPTIONS.map((option) => (
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
            </tr>
          </thead>
          <tbody>
            {stores.length > 0 ? (
              stores.map((store) => (
                <tr
                  key={store.id}
                  className="hover:bg-indigo-500/20 transition"
                >
                  <td
                    title={store.name}
                    className="px-4 py-2 border-b border-white/20 truncate"
                  >
                    {store.name}
                  </td>
                  {role === "admin" && (
                    <td
                      title={store.email}
                      className="px-4 py-2 border-b border-white/20 truncate"
                    >
                      {store.email}
                    </td>
                  )}
                  <td
                    title={store.address}
                    className="px-4 py-2 border-b border-white/20 truncate"
                  >
                    {store.address}
                  </td>
                  <td className="px-4 py-2 flex items-center justify-center border-b border-white/20">
                    ⭐ {(role === "normal" ? store?.overallRating : store?.avgrating)}
                  </td>
                  {role === "normal" && (
                    <td className="px-4 py-2 border-b border-white/20">
                      {editingStore === store.id ? (
                        renderStars(store.id, tempRating, true)
                      ) : (
                        <div className="flex items-center gap-2">
                          {renderStars(store.id, userRatings[store.id] || 0)}
                          <button
                            onClick={() => startEditing(store.id)}
                            className="px-2 py-1 bg-indigo-600 text-white text-xs rounded"
                          >
                            {userRatings[store.id] ? "Edit" : "Rate"}
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={role === "admin" ? 4 : 5}
                  className="text-center py-4 text-gray-300"
                >
                  No stores found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Store Modal */}
      {role === "admin" && addStoreOpen && (
        <AddStoreModal close={() => setAddStoreOpen(false)} />
      )}
    </div>
  );
};

export default StoreTable;