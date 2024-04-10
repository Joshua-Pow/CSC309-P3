import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosUtil";

type Friend = {
  id: number;
  username: string;
};

const IncomingList = () => {
  const [incoming, setIncoming] = useState<Friend[]>([]);

  const fetchIncoming = async () => {
    try {
      const response = await axiosInstance.get("/contacts/incoming/");
      console.log(response);
      setIncoming(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchIncoming();
  }, []);

  const handleAccept = async (username: string) => {
    try {
      const response = await axiosInstance.post("/contacts/accept/", {
        username,
      });
      console.log(response);
      fetchIncoming();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (username: string) => {
    try {
      const response = await axiosInstance.post("/contacts/reject/", {
        username,
      });
      console.log(response);
      fetchIncoming();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ul className="divide-y divide-gray-200">
      {incoming.map((friend) => (
        <li
          key={friend.id}
          className="flex items-center justify-between px-6 py-2 hover:bg-gray-50"
        >
          <span className="font-medium">{friend.username}</span>
          <div className="flex">
            <button
              type="button"
              className="flex w-auto min-w-min flex-shrink items-center overflow-hidden rounded-l-md border bg-green-100 px-2 py-2 text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none"
              onClick={() => handleAccept(friend.username)}
            >
              <span className="hidden sm:inline">Accept</span>
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
              onClick={() => handleReject(friend.username)}
            >
              <span className="hidden sm:inline">Reject</span>
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

export default IncomingList;
