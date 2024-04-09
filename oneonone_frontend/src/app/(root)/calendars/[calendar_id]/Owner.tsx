import React, { useState } from "react";
import CreateCalendarForm from "@/components/CreateCalendarForm";
import { Calendar, CreateCalendarValues } from "../page";
import CustomCalendar from "@/components/CustomCalendar";
import CustomCalendarCard from "@/components/CustomCalendarCard";
import axiosInstance from "@/lib/axiosUtil";
import { toast } from "sonner";

type props = {
  calendarValues: Calendar;
};

const Owner = ({ calendarValues }: props) => {
  const [calendar, setCalendar] = useState<Calendar>(calendarValues);
  const onCalendarSave = async (calendarData: CreateCalendarValues) => {
    console.log("calendarData", calendarData);
    const updatedCalendar = {
      ...calendar,
      title: calendarData.title,
      description: calendarData.description,
      days: calendarData.days.map((day) => ({
        //If the new calendarData has the same day as the old calendar, make sure to copy the particpants and timeslots
        ...(calendar.days.find((d) => d.date === day.date) || {
          date: day.date,
          ranking: day.ranking,
        }),
        ranking: day.ranking,
      })),
    };
    console.log("updatedCalendar", updatedCalendar);
    axiosInstance
      .put(`/calendars/${calendar.id}/`, updatedCalendar)
      .then((res) => {
        if (res.status === 200) toast.success("Calendar updated successfully");
        else toast.error("Failed to update calendar");
        console.log("Calendar updated successfully", res);
      });
    setCalendar(updatedCalendar);
  };
  console.log("calendarValues", calendarValues);
  console.log("calendar", calendar);

  return (
    <div className="flex flex-col items-center p-4 pb-[4.75rem] pt-7">
      <h2 className="mb-10 scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0">
        Edit your calendar
      </h2>
      <div className="mt-8 flex w-full flex-col items-center gap-4 lg:flex-row lg:justify-evenly">
        <div className="flex justify-center lg:self-start">
          <CustomCalendarCard calendar={calendar} hideActions />
        </div>
        <div className="w-[480px]">
          <CreateCalendarForm
            onCalendarCreate={onCalendarSave}
            initialData={{
              title: calendar.title,
              description: calendar.description,
              days: calendar.days.map((day) => ({
                date: new Date(day.date + "T00:00:00"),
                ranking: day.ranking,
              })),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Owner;
