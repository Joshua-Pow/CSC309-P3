import React from "react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FormControl, FormField, Form, FormItem, FormLabel } from "./ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon, Trash, CalendarIcon } from "lucide-react";
import { CreateTimeSlotValues } from "@/app/(root)/calendars/page";
import { AccordionContent } from "@/components/ui/accordion";
import { TimePicker } from "./TimePicker";
import { cn } from "@/lib/utils";

type Props = {
  onTimeSlotCreate: (timeSlotData: CreateTimeSlotValues, dayId: string) => void;
  initialData?: TimeSlots;
  dayId: string;
};

const timeslotsSchema = z.object({
  timeslots: z.array(
    z.object({
      start_time: z.date(),
      end_time: z.date(),
    }),
  ),
});

type TimeSlots = z.infer<typeof timeslotsSchema>;

const CreateTimeSlotForm = ({
  onTimeSlotCreate,
  initialData,
  dayId,
}: Props) => {
  const form = useForm<TimeSlots>({
    resolver: zodResolver(timeslotsSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: initialData
      ? {
          timeslots: initialData.timeslots.map((timeslot) => ({
            start_time: timeslot.start_time,
            end_time: timeslot.end_time,
          })),
        }
      : {},
  });

  const { fields, append, remove } = useFieldArray({
    name: "timeslots",
    control: form.control,
  });

  const onSubmit = async (values: TimeSlots) => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log(form.formState.errors);
      return;
    }

    const modifiedData: CreateTimeSlotValues = {
      timeslots: values.timeslots.map((timeslot) => ({
        ...timeslot,
        start_time: timeslot.start_time,
        end_time: timeslot.end_time,
      })),
    };

    // console.log(modifiedData);
    onTimeSlotCreate(modifiedData, dayId);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div className="p-1">
          {fields.map((field, index) => (
            <div key={field.id} className="mb-5 flex items-end gap-4">
              {index === 0 ? (
                <>
                  <FormField
                    control={form.control}
                    name={`timeslots.${index}.start_time`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-left">Start time</FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[140px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "HH:mm")
                                ) : (
                                  <span>Pick a time</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                          </FormControl>
                          <PopoverContent className="w-auto p-0">
                            <div className="border-t border-border p-3">
                              <TimePicker
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`timeslots.${index}.end_time`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-left">End time</FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[140px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "HH:mm")
                                ) : (
                                  <span>Pick a time</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                          </FormControl>
                          <PopoverContent className="w-auto p-0">
                            <div className="border-t border-border p-3">
                              <TimePicker
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <div>
                    <Button
                      type="button"
                      className="self-center px-2"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name={`timeslots.${index}.start_time`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <FormControl>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[140px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "HH:mm")
                                ) : (
                                  <span>Pick a time</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                          </FormControl>
                          <PopoverContent className="w-auto p-0">
                            <div className="border-t border-border p-3">
                              <TimePicker
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`timeslots.${index}.end_time`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <FormControl>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[140px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "HH:mm")
                                ) : (
                                  <span>Pick a time</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                          </FormControl>
                          <PopoverContent className="w-auto p-0">
                            <div className="border-t border-border p-3">
                              <TimePicker
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    className="self-center px-2"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          className="self-center"
          variant="outline"
          onClick={() => {
            append({
              start_time: new Date(new Date().setHours(0, 0, 0, 0)),
              end_time: new Date(new Date().setHours(0, 0, 0, 0)),
            });
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add a timeslot
        </Button>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateTimeSlotForm;
