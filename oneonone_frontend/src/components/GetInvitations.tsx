import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosUtil";
import { stat } from "fs";

type Invitation = {
  id: number;
  calendar_id: number;
  inviter: string;
  calendar: string;
};

const GetInvitations = () => {
  const [invitations, setInvitations] = useState([]);

  const fetchInvitations = async () => {
    try {
      const response = await axiosInstance.get("/calendars/invitations/");
      setInvitations(response.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (id: number, calendar_id: number) => {
    try {
      const response = await axiosInstance.put(
        "/calendars/" + calendar_id + "/invitations/" + id + "/",
        { status: "accepted" },
      );
      console.log(response);
      fetchInvitations();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecline = async (id: number, calendar_id: number) => {
    try {
      const response = await axiosInstance.put(
        "/calendars/" + calendar_id + "/invitations/" + id + "/",
        { status: "rejected" },
      );
      console.log(response);
      fetchInvitations();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="">
      <ul className="divide-y divide-gray-200">
        {invitations.map((invitation: Invitation) => (
          <div key={invitation.id} className="flex justify-between items-center hover:bg-gray-50">
            <span className="font-medium">{invitation.calendar}</span>
            <span className="font-medium">{invitation.inviter}</span>
            <div className="flex">
              <button
                className="flex w-auto min-w-min items-center overflow-hidden rounded-l-md border bg-green-100 px-2 py-2 text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none"
                onClick={() =>
                  handleAccept(invitation.id, invitation.calendar_id)
                }
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
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </button>
              <button
                className="flex w-auto min-w-min items-center overflow-hidden rounded-r-md border bg-red-100 px-2 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none"
                onClick={() =>
                  handleDecline(invitation.id, invitation.calendar_id)
                }
              >
                <span className="hidden sm:inline">Decline</span>
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
        </div>
        ))}
      </ul>
    </div>
  );
};

export default GetInvitations;
