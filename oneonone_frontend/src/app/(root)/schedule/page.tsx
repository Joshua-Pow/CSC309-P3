"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/lib/axiosUtil";
import { Calendar } from "@/components/ui/calendar";
import { Link, PencilIcon, PlusIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCalendar from "@/components/CreateCalendar";
import CustomCalendar from "@/components/CustomCalendar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import { Icons } from "@/components/Icons";

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

type Calendar = {
  id: number;
  creator_username: string;
  title: string;
  description: string;
  days: Day[];
  participants: Participant[];
};

type CalendarApiResponse = {
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

const Schedule = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const { isLoggedIn } = useAuth();
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
    queryClient.invalidateQueries({ queryKey: ["calendars"] });
  };

  //Any participant can leave a calendar
  const onCalendarLeave = async (calendarId: number) => {
    await axiosInstance.delete(`/calendars/${calendarId}/leave/`);
    setCalendars((prevCalendars) =>
      prevCalendars.filter((calendar) => calendar.id !== calendarId),
    );
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col items-center p-4 pb-[4.75rem] pt-7">
      <h2 className="scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0">
        Create, Edit or View your calendars
      </h2>
      <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.pages.map((page) =>
          page.results.map((calendar) => (
            <Card key={calendar.id}>
              <CardHeader>
                <CardTitle>
                  {calendar.title} - {calendar.id}
                </CardTitle>
                <CardDescription>{calendar.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomCalendar
                  allParticipants={calendar.participants.map(
                    (participant) => participant.username,
                  )}
                  timeslotDensity={calendar.days.reduce(
                    (acc, day) => {
                      const dateKey = `${day.date}T00:00:00`;
                      const uniqueUsernames = day.timeslots
                        ? Array.from(
                            new Set(
                              day.timeslots.map(
                                (timeslot) => timeslot.owner_username,
                              ),
                            ),
                          )
                        : [];
                      acc[dateKey] = uniqueUsernames;
                      return acc;
                    },
                    {} as Record<string, string[]>,
                  )}
                  selectedDays={calendar.days.map(
                    (day) => new Date(`${day.date}T00:00:00`),
                  )}
                />
                <p>Host: {calendar.creator_username}</p>
                <p>Participants:</p>
                {calendar.participants.map((participant) => (
                  <p key={participant.id}>{participant.username}</p>
                ))}
                <p>Days:</p>
                {calendar.days.map((day) => (
                  <p key={day.id}>{day.date}</p>
                ))}
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  disabled={isFetchingNextPage || isLoading}
                  size="icon"
                >
                  <Trash2
                    size={24}
                    onClick={() => onCalendarDelete(calendar.id)}
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <Link size={24} />
                </Button>
                <Button variant="outline" size="icon">
                  <PencilIcon size={24} />
                </Button>
              </CardFooter>
            </Card>
          )),
        )}
        {(isFetchingNextPage || isLoading) && (
          <div className="flex flex-wrap content-center justify-center">
            <Icons.spinner className="h-12 w-12 animate-spin" />
          </div>
        )}
        <div className="flex flex-wrap content-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={isFetchingNextPage}
              >
                <PlusIcon size={24} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new calendar</DialogTitle>{" "}
                <DialogDescription>
                  Input details to create a new calendar to schedule events,
                  click submit when done.
                </DialogDescription>
              </DialogHeader>
              <CreateCalendar onCalendarCreate={onCalendarCreate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div ref={ref} /> {/* This is the element we observe */}
    </div>
  );
};

export default Schedule;
