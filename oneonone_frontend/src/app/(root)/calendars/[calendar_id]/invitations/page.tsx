"use client";

import React from "react";
import { Invitation, columns } from "./columns";
import { DataTable } from "./data-table";
import CustomCalendarCard from "@/components/CustomCalendarCard";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosUtil";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "../../page";

type Props = {
  params: {
    calendar_id: string;
  };
};

type InvitationApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Invitation[];
};

export default function CalendarInvitations({ params }: Props) {
  const { calendar_id } = params;
  const { userDetails } = useAuth();

  const fetchInvitations = async () => {
    const { data: invitations } =
      await axiosInstance.get<InvitationApiResponse>(
        `/calendars/${calendar_id}/invitations/`,
      );
    return invitations;
  };

  const fetchCalendarDetails = async () => {
    const { data } = await axiosInstance.get<Calendar>(
      `/calendars/${calendar_id}/`,
    );
    return data;
  };

  const {
    data: invitations,
    isLoading: invitationsLoading,
    error: invitationsError,
  } = useQuery({
    queryKey: ["invitations", calendar_id],
    queryFn: fetchInvitations,
  });

  const {
    data: calendarDetails,
    isLoading: calendarLoading,
    error: calendarError,
  } = useQuery({
    queryKey: ["calendar", calendar_id],
    queryFn: fetchCalendarDetails,
  });

  return (
    <div className="flex flex-col items-center p-4 pb-[4.75rem] pt-7">
      <h2 className="mb-10 scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0">
        Share your calendar
      </h2>
      <div className="flex w-full flex-col items-center justify-evenly gap-4 lg:flex-row lg:items-start">
        {calendarLoading ? (
          <div className="max-w-[324px] rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="mb-2 h-[24px] w-[276px]" />
              <Skeleton className="h-[20px] w-[276px]" />
            </div>
            <div className="p-6 pt-0">
              <Skeleton className="h-[306px] w-[276px]" />
            </div>
          </div>
        ) : (
          <CustomCalendarCard
            calendar={calendarDetails}
            userDetails={userDetails!}
            hideActions
          />
        )}
        {invitationsLoading ? (
          <div>
            <Skeleton className="h-[306px] w-[276px]" />
          </div>
        ) : (
          <DataTable columns={columns} data={invitations} />
        )}
      </div>
    </div>
  );
}
