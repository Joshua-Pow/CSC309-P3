import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { LockOpen, Lock, CalendarIcon, Clock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimePicker } from "./TimePicker";
import axiosInstance from "@/lib/axiosUtil";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import LockCalendarButton from "./LockCalendarButton";

type Props = {
  calendarId: number;
  disabled: boolean;
  isLocked: boolean;
  recommendedTime:
    | {
        date: string;
        startTime: string;
        endTime: string;
      }
    | string;
};

const finzalizeCalendarSchema = z
  .object({
    date: z.date({ required_error: "Date is required" }),
    startTime: z.date({ required_error: "Start time is required" }),
    endTime: z.date({ required_error: "End time is required" }),
  })
  .refine(
    (data) => {
      return data.endTime > data.startTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

function LockPopup({ calendarId, disabled, isLocked, recommendedTime }: Props) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof finzalizeCalendarSchema>>({
    resolver: zodResolver(finzalizeCalendarSchema),
    defaultValues: {
      date:
        typeof recommendedTime === "string"
          ? new Date()
          : new Date(recommendedTime.date + "T00:00:00"),
      startTime:
        typeof recommendedTime === "string"
          ? new Date(new Date().setHours(0, 0, 0, 0))
          : new Date(
              new Date().setHours(
                Number(recommendedTime.startTime.split(":")[0]),
                Number(recommendedTime.startTime.split(":")[1]),
                0,
              ),
            ),
      endTime:
        typeof recommendedTime === "string"
          ? new Date(new Date().setHours(0, 0, 0, 0))
          : new Date(
              new Date().setHours(
                Number(recommendedTime.endTime.split(":")[0]),
                Number(recommendedTime.endTime.split(":")[1]),
                0,
                0,
              ),
            ),
    },
  });

  const onSubmit = (values: z.infer<typeof finzalizeCalendarSchema>) => {
    //Formate date to be YYYY-MM-DD
    //Format endTime to be HH:MM and key end_time
    //Format startTime to be HH:MM and key start_time
    const formattedData = {
      final_date: format(values.date, "yyyy-MM-dd"),
      final_timeslot_start: format(values.startTime, "HH:mm"),
      final_timeslot_end: format(values.endTime, "HH:mm"),
    };
    //USE A TOAST TO CONFIRM THE SUCCESS OR ERROR
    axiosInstance
      .put(`/calendars/${calendarId}/finalize/`, formattedData)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Meeting time confirmed successfully");
          queryClient.invalidateQueries({ queryKey: ["calendars"] });
        } else {
          toast.error("Failed to confirm meeting time");
        }
      });
    console.log(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <LockCalendarButton
          onClick={() => setOpen(true)}
          disabled={isLocked || disabled}
          isLocked={isLocked}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>
          <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Confirm meeting time
          </h4>
        </DialogTitle>
        <DialogDescription>
          Select the Day and Time for the meeting
        </DialogDescription>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Recomended time:
            </h4>
            <p className="leading-7">
              {typeof recommendedTime === "string"
                ? recommendedTime
                : `${recommendedTime.date} at ${recommendedTime.startTime} - ${recommendedTime.endTime}`}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Selected time:
            </h4>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Meeting Date</FormLabel>
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
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1),
                              )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  {" "}
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-left">
                          Start Time (24hr)
                        </FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[180px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "HH:mm")
                                ) : (
                                  <span>Pick a time</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                          </FormControl>
                          <PopoverContent className="w-auto p-0">
                            <div className="p-3">
                              <TimePicker
                                setDate={field.onChange}
                                date={field.value}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-left">
                          End Time (24hr)
                        </FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[180px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "HH:mm")
                                ) : (
                                  <span>Pick a time</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                          </FormControl>
                          <PopoverContent className="w-auto p-0">
                            <div className="p-3">
                              <TimePicker
                                setDate={field.onChange}
                                date={field.value}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex">
                  <DialogClose asChild>
                    <Button className="ml-auto" type="submit">
                      Submit
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LockPopup;
