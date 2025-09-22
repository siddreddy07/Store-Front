import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contextApi/AuthContext";
import axios from "axios";

const StoreOwnerDashboard = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);

  const [overallRating, setOverallRating] = useState(0);

  const [sortOrder, setSortOrder] = useState("All");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchUsers = async (sort = "All") => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/store/get-store-details`, {
        params: { sortOrder: sort.toLowerCase()} , withCredentials:true  },
      );

      setOverallRating(data.overallRating);

      const ratings = data.store.ratings.map((r) => ({
        name: r.user.name,
        rating: r.rating,
      }));

      setUsers(ratings);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user ratings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers(sortOrder);
    }
  }, [activeTab, sortOrder]);

  return (
    <div className="p-6 bg-transparent text-white">
      {/* Store name */}
      <h1 className="text-center text-2xl mb-4 -mt-4">{user?.name} Store</h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Users Card (clickable) */}
        <div
          className={`p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg cursor-pointer transition hover:bg-white/20 ${
            activeTab === "users" ? "ring-2 ring-indigo-400" : ""
          }`}
          onClick={() => setActiveTab("users")}
        >
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-gray-300 text-sm mt-2">
            View all users who submitted ratings
          </p>
        </div>

        {/* Overall Rating Card */}
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Total Rating</h2>
          <p className="text-3xl font-bold text-indigo-400">
            ⭐ {overallRating}
          </p>
        </div>
      </div>

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">User Ratings</h3>

          {/* Sort dropdown */}
          <div className="mb-4 flex items-center gap-2">
            <label className="text-gray-300">Sort by Name:</label>
            <select
              className="bg-zinc-800 text-white px-2 py-1 rounded"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="All">All</option>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>

          {/* Loading / Error messages */}
          {loading && <p className="text-gray-300">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {/* Users Table */}
          {!loading && !error && (
            <div className="overflow-x-auto scrollable-table">
              <table className="w-full rounded-xl text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-zinc-800 sticky top-0">
                    <th className="px-4 py-2 border-b border-white/20">User</th>
                    <th className="px-4 py-2 border-b border-white/20">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={i}
                      className="hover:bg-indigo-500/20 transition cursor-pointer"
                    >
                      <td className="px-4 py-2 border-b border-white/10">{u.name}</td>
                      <td className="px-4 py-2 border-b border-white/10">
                        ⭐ {u.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
