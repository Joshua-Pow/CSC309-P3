"use client";
import React, { useEffect, useState } from "react";
import Owner from "./Owner";
import Participant from "./Participant";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosUtil";
import { Calendar } from "../page";

type Props = {
  params: {
    calendar_id: string;
  };
};

function CalendarDetails({ params }: Props) {
  const router = useRouter();
  const { calendar_id } = params;
  const { userDetails, isLoggedIn } = useAuth();
  const [calendarDetails, setCalendarDetails] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCalendarDetails = async () => {
      const { data } = await axiosInstance.get<Calendar>(
        `/calendars/${calendar_id}/`,
      );
      setCalendarDetails(data);
      // Assuming the calendar data has a field `creator_username` to identify the owner
      setUserRole(
        data.creator_username === userDetails?.username
          ? "owner"
          : "participant",
      );
    };

    if (calendar_id) {
      fetchCalendarDetails();
    }
  }, [calendar_id, userDetails]);

  if (!isLoggedIn) {
    return null;
  } else if (!calendarDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userRole === "owner" ? (
        <Owner calendarValues={calendarDetails} />
      ) : (
        <Participant calendarValues={calendarDetails} />
      )}
    </>
  );
}

export default CalendarDetails;
