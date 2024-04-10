import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CustomCalendar from "./CustomCalendar";
import { useRouter } from "next/navigation";
import { Calendar } from "@/app/(root)/calendars/page";
import { UserDetails } from "@/context/AuthContext";
import LockPopup from "./LockPopup";
import DeleteCalendarButton from "./DeleteCalendarButton";
import ShareCalendarButton from "./ShareCalendarButton";
import DownloadCalendarButton from "./DownloadCalendarButton";
import EditCalendarButton from "./EditCalendarButton";

type PropsWithoutFooter = {
  hideActions: true;
  calendar: Calendar;
};

type PropsWithFooter = {
  hideActions: false;
  calendar: Calendar;
  userDetails: UserDetails;
  isLoading: boolean;
  onCalendarDelete: (calendarId: number) => void;
  onCalendarLeave: (calendarId: number) => void;
};

type Props = PropsWithoutFooter | PropsWithFooter;

const getRecommendedTime = (calendar: Calendar) => {
  //If theres no timeslots then return string that says no timeslots
  if (calendar.days.every((day) => day.timeslots?.length === 0)) {
    return "No timeslots have been added yet.";
  }
  // Find the day with the most unique participants and if there's a tie, take the day with the highest ranking
  const dayWithMostParticipants = calendar.days.reduce((prev, current) => {
    const prevUniqueParticipants = new Set(
      prev.timeslots?.map((ts) => ts.owner_username),
    ).size;
    const currentUniqueParticipants = new Set(
      current.timeslots?.map((ts) => ts.owner_username),
    ).size;
    if (currentUniqueParticipants > prevUniqueParticipants) {
      return current;
    } else if (currentUniqueParticipants === prevUniqueParticipants) {
      return current.ranking > prev.ranking ? current : prev;
    }
    return prev;
  }, calendar.days[0]);

  // Find the 1 hour window with the most overlapping timeslots in that day
  const timeslots = dayWithMostParticipants.timeslots || [];
  const timeRanges = timeslots.map((ts) => ({
    start: new Date(`1970/01/01 ${ts.start_time}`),
    end: new Date(`1970/01/01 ${ts.end_time}`),
  }));

  const timePoints = timeRanges
    .flatMap((tr) => [tr.start.getTime(), tr.end.getTime()])
    .sort((a, b) => a - b);
  let maxOverlap = 0;
  let maxOverlapTime = 0;
  for (let i = 0; i < timePoints.length - 1; i++) {
    const currentOverlap = timeRanges.filter(
      (tr) =>
        tr.start.getTime() <= timePoints[i] &&
        tr.end.getTime() >= timePoints[i + 1],
    ).length;
    if (currentOverlap > maxOverlap) {
      maxOverlap = currentOverlap;
      maxOverlapTime = timePoints[i];
    }
  }

  const recommendedStartTime = new Date(maxOverlapTime);
  const recommendedEndTime = new Date(maxOverlapTime + 60 * 60 * 1000); // Add 1 hour
  //return an object with the date and start and end time of the recommended time
  return {
    date: dayWithMostParticipants.date,
    startTime: recommendedStartTime
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5),
    endTime: recommendedEndTime.toTimeString().split(" ")[0].substring(0, 5),
  };
};

const CustomCalendarCard = ({ calendar, hideActions, ...props }: Props) => {
  const router = useRouter();
  return (
    <Card
      className={`max-w-[324px] ${calendar.is_finalized ? "border-2 border-primary/30" : ""}`}
      key={calendar.id}
    >
      <CardHeader>
        <CardTitle>
          {calendar.title} - {calendar.id}
        </CardTitle>
        <CardDescription>{calendar.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CustomCalendar
          isFinalized={calendar.is_finalized}
          isFinalizedMessage={
            calendar.is_finalized
              ? `${calendar.final_timeslot_start} - ${calendar.final_timeslot_end}`
              : undefined
          }
          allParticipants={calendar.participants.map(
            (participant) => participant.username,
          )}
          timeslotDensity={calendar.days.reduce(
            (acc, day) => {
              const dateKey = `${day.date}T00:00:00`;
              const uniqueUsernames = day.timeslots
                ? Array.from(
                    new Set(
                      day.timeslots.map((timeslot) => timeslot.owner_username),
                    ),
                  )
                : [];
              acc[dateKey] = uniqueUsernames;
              return acc;
            },
            {} as Record<string, string[]>,
          )}
          selectedDays={
            calendar.is_finalized
              ? [new Date(calendar.final_date + "T00:00:00")]
              : calendar.days.map((day) => new Date(`${day.date}T00:00:00`))
          }
        />
        {/* <p>Host: {calendar.creator_username}</p>
                <p>Participants:</p>
                {calendar.participants.map((participant) => (
                  <p key={participant.id}>{participant.username}</p>
                ))}
                <p>Days:</p>
                {calendar.days.map((day) => (
                  <p key={day.id}>{day.date}</p>
                ))} */}
      </CardContent>
      {!hideActions && (
        <CardFooter className="flex items-center justify-between">
          <DeleteCalendarButton
            disabled={(props as PropsWithFooter).isLoading}
            onClick={() => {
              if (props.userDetails?.username === calendar.creator_username) {
                (props as PropsWithFooter).onCalendarDelete(calendar.id);
              } else {
                (props as PropsWithFooter).onCalendarLeave(calendar.id);
              }
            }}
          />
          <ShareCalendarButton
            disabled={
              calendar.is_finalized ||
              props.userDetails?.username !== calendar.creator_username
            }
            onClick={() => router.push(`/calendars/${calendar.id}/invitations`)}
          />
          <DownloadCalendarButton
            disabled={!calendar.is_finalized}
            onClick={() => {
              console.log("Download");
            }}
          />
          <EditCalendarButton
            disabled={calendar.is_finalized}
            onClick={() => router.push(`/calendars/${calendar.id}`)}
          />
          <LockPopup
            calendarId={calendar.id}
            disabled={props.userDetails?.username !== calendar.creator_username}
            isLocked={calendar.is_finalized}
            recommendedTime={getRecommendedTime(calendar)}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default CustomCalendarCard;
