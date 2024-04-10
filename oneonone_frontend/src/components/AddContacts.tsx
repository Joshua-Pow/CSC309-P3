import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosUtil";

type Friend = {
  id: number;
  username: string;
};

const AddContacts = () => {
  const [allUsers, setAllUsers] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<Friend[]>([]);
  const [excludedUsernames, setExcludedUsernames] = useState<Set<string>>(
    new Set(),
  );

  const fetchUsers = async () => {
    try {
      const searchResponse = await axiosInstance.get("/contacts/search/");
      const friendsResponse = await axiosInstance.get("/contacts/friends/");
      const incomingResponse = await axiosInstance.get("/contacts/incoming/");
      const outgoingResponse = await axiosInstance.get("/contacts/outgoing/");
      const excludeNames = new Set([
        ...friendsResponse.data.map((u: Friend) => u.username),
        ...incomingResponse.data.map((u: Friend) => u.username),
        ...outgoingResponse.data.map((u: Friend) => u.username),
      ]);
      setAllUsers(searchResponse.data);
      setExcludedUsernames(excludeNames);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = allUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !excludedUsernames.has(user.username),
    );
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers, excludedUsernames]);

  const handleAdd = async (username: string) => {
    try {
      const response = await axiosInstance.post("/contacts/add/", { username });
      console.log(response);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleBlock = async (username: string) => {
    try {
      const response = await axiosInstance.post("/contacts/block/", {
        username,
      });
      console.log(response);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add-contacts">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-primary/50 disabled:opacity-50"
      />
      <ul className="divide-y divide-gray-200 pt-3">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between px-6 py-2 hover:bg-gray-50"
          >
            <span className="font-medium">{user.username}</span>
            <div className="flex">
              <button
                className="flex w-auto min-w-min items-center overflow-hidden rounded-l-md border bg-green-100 px-2 py-2 text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none"
                onClick={() => handleAdd(user.username)}
              >
                <span className="hidden sm:inline">Add</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </button>
              <button
                className="flex w-auto min-w-min items-center overflow-hidden rounded-r-md border bg-red-100 px-2 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none"
                onClick={() => handleBlock(user.username)}
              >
                <span className="hidden sm:inline">Block</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddContacts;
