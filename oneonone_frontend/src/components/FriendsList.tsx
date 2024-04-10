import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosUtil";

type Friend = {
  id: number;
  username: string;
};

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchFriends = async () => {
    try {
      const response = await axiosInstance.get("/contacts/friends/");
      console.log(response);
      setFriends(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleUnadd = async (username: string) => {
    try {
      const response = await axiosInstance.post("/contacts/unadd/", {
        username,
      });
      console.log(response);
      fetchFriends();
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
      fetchFriends();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ul className="divide-y divide-gray-200">
      {friends.map((friend) => (
        <li
          key={friend.id}
          className="flex items-center justify-between py-2 px-6 hover:bg-gray-50"
        >
          <span className="font-medium">{friend.username}</span>
          <div className="flex">
            <button
              type="button"
              className="flex w-auto min-w-min flex-shrink items-center overflow-hidden rounded-l-md border bg-orange-100 px-2 py-2 text-sm font-medium text-orange-800 hover:bg-orange-200 focus:outline-none"
              onClick={() => handleUnadd(friend.username)}
            >
              <span className="hidden sm:inline">Unadd</span>
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
            <button
              type="button"
              className="flex w-auto min-w-min flex-shrink items-center overflow-hidden rounded-r-md border bg-red-100 px-2 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none"
              onClick={() => handleBlock(friend.username)}
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
  );
};

export default FriendsList;
