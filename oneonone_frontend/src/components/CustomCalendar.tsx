import React, { useRef } from "react";
import { Calendar as UICalendar } from "@/components/ui/calendar";
import { Button, DayProps, useDayRender } from "react-day-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CheckCircleIcon, XCircleIcon } from "lucide-react";

type CustomCalendarProps = {
  allParticipants?: string[];
  timeslotDensity?: Record<string, string[]>;
  selectedDays?: Date[];
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  allParticipants = [],
  timeslotDensity = {},
  selectedDays = [],
}) => {
  const getGroup = (count: number) => {
    if (allParticipants.length === 0) return "group-0";
    const ratio = count / allParticipants.length;
    if (ratio === 0)
      return "group-0"; // No timeslots filled
    else if (ratio <= 0.1) return "group-1";
    else if (ratio <= 0.2) return "group-2";
    else if (ratio <= 0.3) return "group-3";
    else if (ratio <= 0.4) return "group-4";
    else if (ratio <= 0.5) return "group-5";
    else if (ratio <= 0.6) return "group-6";
    else if (ratio <= 0.7) return "group-7";
    else if (ratio <= 0.8) return "group-8";
    else if (ratio <= 0.9) return "group-9";
    else if (ratio === 1)
      return "group-10"; // Only when 100% of the slots are filled
    else return "group-9"; // Adjusted to ensure ratios above 0.9 but not 1 fall into group-9
  };

  const modifiersStyles = {
    "group-0": {
      border: "2px solid hsl(var(--primary))",
      backgroundColor: "transparent",
      color: "hsl(var(--primary))",
    },
    "group-1": { backgroundColor: "hsl(var(--primary)/0.1)" },
    "group-2": { backgroundColor: "hsl(var(--primary)/0.2)" },
    "group-3": { backgroundColor: "hsl(var(--primary)/0.3)" },
    "group-4": { backgroundColor: "hsl(var(--primary)/0.4)" },
    "group-5": { backgroundColor: "hsl(var(--primary)/0.5)" },
    "group-6": { backgroundColor: "hsl(var(--primary)/0.6)" },
    "group-7": { backgroundColor: "hsl(var(--primary)/0.7)" },
    "group-8": { backgroundColor: "hsl(var(--primary)/0.8)" },
    "group-9": { backgroundColor: "hsl(var(--primary)/0.9)" },
    "group-10": { backgroundColor: "hsl(var(--primary)/1)" },
  };

  const modifiers = Object.keys(timeslotDensity || {}).reduce(
    (acc, dateStr) => {
      const count = timeslotDensity![dateStr].length;
      const group = getGroup(count); // Get the density group based on the count
      if (!acc.hasOwnProperty(group)) {
        acc[group] = [];
      }
      acc[group].push(new Date(dateStr)); // Add the date to the appropriate density group
      return acc;
    },
    {} as Record<string, Date[]>,
  );

  return (
    <UICalendar
      mode="multiple"
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      selected={selectedDays}
      components={{
        Day: (props: DayProps): JSX.Element => {
          const buttonRef = useRef<HTMLButtonElement>(null);
          const dayRender = useDayRender(
            props.date,
            props.displayMonth,
            buttonRef,
          );

          if (dayRender.isHidden) {
            return <div role="gridcell"></div>;
          }
          if (!dayRender.isButton) {
            return <div {...dayRender.divProps} />;
          }
          if (dayRender.activeModifiers.selected) {
            const dateKey = `${props.date.toISOString().split("T")[0]}T00:00:00`;
            const timeslotSubmitters = timeslotDensity[dateKey];
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      name="day"
                      ref={buttonRef}
                      {...dayRender.buttonProps}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {allParticipants.length === 0 ? (
                      <p>No participants in calendar</p>
                    ) : (
                      <ul>
                        {allParticipants.map((username) => (
                          <li
                            key={username}
                            className="flex items-center space-x-1"
                          >
                            {timeslotSubmitters.includes(username) ? (
                              <CheckCircleIcon
                                size={16}
                                className="text-green-500"
                              />
                            ) : (
                              <XCircleIcon size={16} className="text-red-500" />
                            )}
                            <span>{username}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
          return (
            <Button name="day" ref={buttonRef} {...dayRender.buttonProps} />
          );
        },
      }}
    />
  );
};

export default CustomCalendar;
