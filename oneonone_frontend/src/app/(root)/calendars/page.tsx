"use client";

import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axiosUtil";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import { Icons } from "@/components/Icons";
import CreateCalendarCard from "@/components/CreateCalendarCard";
import CustomCalendarCard from "@/components/CustomCalendarCard";

type Participant = {
  id: number;
  username: string;
  email: string;
};

type Timeslot = {
  id: number;
  start_time: string;
  end_time: string;
  owner_username: string;
};

type Day = {
  id: number;
  date: string;
  ranking: number;
  timeslots: Timeslot[] | null;
};

export type Calendar = {
  id: number;
  creator_username: string;
  title: string;
  description: string;
  days: Day[];
  participants: Participant[];
};

export type CalendarApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Calendar[];
};

export type CreateCalendarValues = {
  title: string;
  description: string;
  days: {
    date: string;
    ranking: number;
  }[];
};

const Calendars = () => {
  const [createCalendarOpen, setCreateCalendarOpen] = useState(false);
  const { isLoggedIn, userDetails } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  const fetchCalendars = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get<CalendarApiResponse>(
      `/calendars/?page=${pageParam}`,
    );
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      {
        queryKey: ["calendars"],
        queryFn: fetchCalendars,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
          const totalPages = Math.ceil(lastPage.count / itemsPerPage);
          const nextPage = allPages.length + 1;
          return nextPage <= totalPages ? nextPage : undefined;
        },
      }, // These are the query options
    );

  const loaderRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: loaderRef.current,
    rootMargin: "200px",
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry]);

  //Only a host can delete their calendar
  const onCalendarDelete = async (calendarId: number) => {
    await axiosInstance.delete(`/calendars/${calendarId}/`);
    // Invalidate the 'calendars' query to refetch data and ensure consistency
    queryClient.invalidateQueries({ queryKey: ["calendars"] });
  };

  const onCalendarCreate = async (values: CreateCalendarValues) => {
    await axiosInstance.post("/calendars/", values);
    // Invalidate the 'calendars' query to refetch data and ensure consistency
    queryClient.invalidateQueries({ queryKey: ["calendars"] }).then(() => {
      setCreateCalendarOpen(false);
    });
  };

  //Any participant can leave a calendar
  const onCalendarLeave = async (calendarId: number) => {
    await axiosInstance.delete(`/calendars/${calendarId}/`);
    queryClient.invalidateQueries({ queryKey: ["calendars"] }).then(() => {
      setCreateCalendarOpen(false);
    });
  };

  if (!isLoggedIn) {
    return null;
  }
  console.log("userDetails", userDetails);
  return (
    <div className="flex flex-col items-center p-4 pb-[4.75rem] pt-7">
      <h2 className="scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0">
        Create, Edit or View your calendars
      </h2>
      <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateCalendarCard
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          createCalendarOpen={createCalendarOpen}
          setCreateCalendarOpen={setCreateCalendarOpen}
          onCalendarCreate={onCalendarCreate}
        />
        {data?.pages.map((page) =>
          page.results.map((calendar) => (
            <CustomCalendarCard
              key={calendar.id}
              calendar={calendar}
              userDetails={userDetails}
              isLoading={isFetchingNextPage || isLoading}
              hideActions={false}
              onCalendarDelete={onCalendarDelete}
              onCalendarLeave={onCalendarLeave}
            />
          )),
        )}
        {(isFetchingNextPage || isLoading) && (
          <div className="flex flex-wrap content-center justify-center">
            <Icons.spinner className="h-12 w-12 animate-spin" />
          </div>
        )}
      </div>
      <div ref={ref} /> {/* This is the element we observe */}
    </div>
  );
};

export default Calendars;
