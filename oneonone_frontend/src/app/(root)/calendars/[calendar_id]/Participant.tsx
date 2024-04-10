import React, { useState } from "react";
import CreateTimeSlotForm from "@/components/CreateTimeSlotForm";
import CustomCalendarCard from "@/components/CustomCalendarCard";
import { Calendar, CreateTimeSlotValues } from "../page";
import axiosInstance from "@/lib/axiosUtil";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import moment from "moment";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

type props = {
  calendarValues: Calendar;
};

const Participant = ({ calendarValues }: props) => {
  const { userDetails } = useAuth();
  const queryClient = useQueryClient();
  const [calendar, setCalendar] = useState<Calendar>(calendarValues);

  const dateToTime = (date: Date) => {
    return date.toTimeString().split(" ")[0].substring(0, 5);
  };

  const onTimeSlotSave = async (
    timeslotData: CreateTimeSlotValues,
    dayId: string,
  ) => {
    //console.log("timeslot", timeslotData);
    const updatedTimeslots = timeslotData.timeslots!.map((timeslot) => ({
      start_time: dateToTime(timeslot.start_time),
      end_time: dateToTime(timeslot.end_time),
    }));

    axiosInstance
      .post(
        `/calendars/${calendar.id}/day/${dayId}/timeslot/`,
        updatedTimeslots,
      )
      .then((res) => {
        if (res.status === 201) {
          toast.success("Timeslots updated successfully");
          queryClient.invalidateQueries({ queryKey: ["calendars"] });
        } else {
          toast.error("Failed to update timeslots");
        }
        console.log("Timeslots updated successfully", res);
      });
  };

  const getDate = (time: string) => {
    const customDate = new Date();
    customDate.setHours(
      parseInt(time.substring(0, 2)),
      parseInt(time.substring(3, 5)),
      0,
      0,
    );

    return customDate;
  };

  return (
    <div className="flex flex-col items-center p-4 pb-[4.75rem] pt-7">
      <h2 className="mb-10 scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0">
        Edit your calendar
      </h2>
      <div className="mt-8 flex w-full flex-col gap-4 lg:flex-row lg:justify-center">
        <div className="sticky mr-20 flex justify-center lg:self-start">
          <CustomCalendarCard calendar={calendar} hideActions />
        </div>
        <Accordion type="single" collapsible className="w-[480px]">
          {calendar?.days.map((day) => (
            <AccordionItem key={day.id} value={`day-${day.id}`}>
              <AccordionTrigger>
                {moment(day.date).format("MMMM D (dddd)")}
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <p className="text-base font-medium leading-none">
                    Current timeslots:
                  </p>
                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    {day
                      .timeslots!.filter(
                        (timeslot) =>
                          timeslot.owner_username !== userDetails.username,
                      )
                      .map((timeslot) => (
                        <li key={timeslot.id}>
                          {timeslot.owner_username} :{" "}
                          {dateToTime(getDate(timeslot.start_time))} -{" "}
                          {dateToTime(getDate(timeslot.end_time))}
                        </li>
                      ))}
                  </ul>
                </div>
                <CreateTimeSlotForm
                  onTimeSlotCreate={onTimeSlotSave}
                  initialData={{
                    timeslots: day
                      .timeslots!.filter(
                        (timeslot) =>
                          timeslot.owner_username === userDetails.username,
                      )
                      .map((timeslot) => ({
                        start_time: getDate(timeslot.start_time),
                        end_time: getDate(timeslot.end_time),
                      })),
                  }}
                  dayId={String(day.id)}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Participant;
