import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosUtil";
import { useRouter } from "next/navigation";

type Invitation = {
  id: number;
  calendar_id: number;
  inviter: string;
  calendar: string;
};

const GetInvitations = () => {
  const router = useRouter();
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
    <div>
      {invitations.length === 0 ? (
        <p className="text-center font-medium">No Invitations Available</p>
      ) : (
        <div className="my-6 w-full overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  Calendar Title
                </th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  Inviter
                </th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation: Invitation) => (
                <tr
                  key={invitation.id}
                  className="m-0 border-t p-0 even:bg-muted"
                >
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {invitation.calendar}
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {invitation.inviter}
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    <div className="flex">
                      <button
                        className="flex w-auto min-w-min items-center overflow-hidden rounded-l-md border bg-green-100 px-2 py-2 text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none"
                        onClick={() => {
                          handleAccept(invitation.id, invitation.calendar_id);
                          router.push("/calendars/" + invitation.calendar_id);
                        }}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        // <ul className="divide-y divide-gray-200">
        //   {invitations.map((invitation: Invitation) => (
        //     <div
        //       key={invitation.id}
        //       className="flex items-center justify-between hover:bg-gray-50"
        //     >
        //       <span className="font-medium">{invitation.calendar}</span>
        //       <span className="font-medium">{invitation.inviter}</span>
        //       <div className="flex">
        //         <button
        //           className="flex w-auto min-w-min items-center overflow-hidden rounded-l-md border bg-green-100 px-2 py-2 text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none"
        //           onClick={() => {
        //             handleAccept(invitation.id, invitation.calendar_id);
        //             router.push("/calendars/" + invitation.calendar_id);
        //           }}
        //         >
        //           <span className="hidden sm:inline">Accept</span>
        //           <svg
        //             className="h-4 w-4"
        //             fill="none"
        //             stroke="currentColor"
        //             viewBox="0 0 24 24"
        //             xmlns="http://www.w3.org/2000/svg"
        //           >
        //             <path
        //               strokeLinecap="round"
        //               strokeLinejoin="round"
        //               strokeWidth="2"
        //               d="M5 13l4 4L19 7"
        //             ></path>
        //           </svg>
        //         </button>
        //         <button
        //           className="flex w-auto min-w-min items-center overflow-hidden rounded-r-md border bg-red-100 px-2 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none"
        //           onClick={() =>
        //             handleDecline(invitation.id, invitation.calendar_id)
        //           }
        //         >
        //           <span className="hidden sm:inline">Decline</span>
        //           <svg
        //             className="h-4 w-4"
        //             fill="none"
        //             stroke="currentColor"
        //             viewBox="0 0 24 24"
        //             xmlns="http://www.w3.org/2000/svg"
        //           >
        //             <path
        //               strokeLinecap="round"
        //               strokeLinejoin="round"
        //               strokeWidth="2"
        //               d="M6 18L18 6M6 6l12 12"
        //             ></path>
        //           </svg>
        //         </button>
        //       </div>
        //     </div>
        //   ))}
        // </ul>
      )}
    </div>
  );
};

export default GetInvitations;
