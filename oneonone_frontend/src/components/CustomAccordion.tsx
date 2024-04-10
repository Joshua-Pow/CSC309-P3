import { Day } from "@/app/(root)/calendars/page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import moment from "moment";
import { TimePicker } from "./TimePicker";
import { useState } from "react";

type Props = {
  dayArray: Day[];
};

export function CustomAccordion({ dayArray }: Props) {
  const [date, setDate] = useState<Date>();

  return (
    <Accordion type="single" collapsible className="w-[480px]">
      {dayArray.map((day) => (
        <AccordionItem key={day.id} value={`day-${day.id}`}>
          <AccordionTrigger>
            {moment(day.date).format("MMMM D (dddd)")}
          </AccordionTrigger>
          <AccordionContent>
            {day?.timeslots?.map((timeslot) => (
              <div key={timeslot.id} className="flex">
                <div className="mr-10">
                  from
                  <TimePicker
                    date={date}
                    setDate={setDate}
                    //date={getDate(timeslot.start_time)}
                  />
                </div>
                <div>
                  to
                  <TimePicker
                    date={date}
                    setDate={setDate}
                    //date={getDate(timeslot.end_time)}
                  />
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
