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
import { Button } from "./ui/button";
import { PencilIcon, Trash2, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/app/(root)/calendars/page";
import { UserDetails } from "@/context/AuthContext";

type PropsWithoutFooter = {
  hideActions: true;
  calendar: Calendar;
  userDetails: UserDetails;
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

const CustomCalendarCard = ({
  calendar,
  hideActions,
  userDetails,
  ...props
}: Props) => {
  const router = useRouter();
  return (
    <Card className="max-w-[324px]" key={calendar.id}>
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
                      day.timeslots.map((timeslot) => timeslot.owner_username),
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
          <Button
            variant="secondary"
            disabled={(props as PropsWithFooter).isLoading}
            onClick={() => {
              if (userDetails?.username === calendar.creator_username) {
                (props as PropsWithFooter).onCalendarDelete(calendar.id);
              } else {
                (props as PropsWithFooter).onCalendarLeave(calendar.id);
              }
            }}
            size="icon"
          >
            <Trash2 size={24} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/calendars/${calendar.id}/invitations`)}
            disabled={userDetails?.username !== calendar.creator_username}
          >
            <Link size={24} />
          </Button>
          <Button
            size="icon"
            onClick={() => router.push(`/calendars/${calendar.id}`)}
          >
            <PencilIcon size={24} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CustomCalendarCard;
