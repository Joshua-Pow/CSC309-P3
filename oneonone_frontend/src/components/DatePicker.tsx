import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FormControl } from "./ui/form";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";

type Props = {
  field:
    | ControllerRenderProps<
        {
          title: string;
          description: string;
          days: {
            date: Date;
            ranking: number;
          }[];
        },
        `days.${number}.date`
      >
    | ControllerRenderProps<
        {
          title: string;
          description: string;
          days: {
            date: Date;
            ranking: number;
          }[];
        },
        `days.0.date`
      >;
};

const DatePicker = ({ field }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground",
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) =>
            date < new Date(new Date().setDate(new Date().getDate() - 1))
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
