"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/lib/axiosUtil";
import { Calendar } from "@/components/ui/calendar";
import { PlusIcon } from "lucide-react";
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

const Schedule = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>("/calendars/");
  const loader = useRef(null);

  const fetchCalendars = async () => {
    if (!nextUrl) return;
    const response = await axiosInstance.get(nextUrl);
    const data = response.data;
    setCalendars((prevCalendars) => [...prevCalendars, ...data.results]);
    setNextUrl(
      data.next
        ? new URL(data.next).pathname + new URL(data.next).search
        : null,
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextUrl) {
          fetchCalendars();
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [nextUrl]);

  return (
    <div className="flex flex-col items-center p-4 pb-[4.75rem] pt-7">
      <h2 className="scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0">
        Create, Edit or View your calendars
      </h2>
      <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calendars.map((calendar) => (
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
          </Card>
        ))}
        <div className="flex flex-wrap content-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
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
              <CreateCalendar />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div ref={loader} /> {/* This is the element we observe */}
    </div>
  );
};

export default Schedule;
