import React from "react";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import {
  FormControl,
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "./DatePicker";
import { PlusIcon, Trash } from "lucide-react";
import { CreateCalendarValues } from "@/app/(root)/schedule/page";

type Props = {
  onCalendarCreate: (calendarData: CreateCalendarValues) => Promise<void>;
};

const calendarSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  days: z.array(
    z.object({
      date: z.date(),
      ranking: z.number().int().positive("Must be > 0"),
    }),
  ),
});

type Calendar = z.infer<typeof calendarSchema>;

function formatDate(date: Date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const CreateCalendar = ({ onCalendarCreate }: Props) => {
  const form = useForm<Calendar>({
    resolver: zodResolver(calendarSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "days",
    control: form.control,
  });

  const onSubmit = async (values: Calendar) => {
    //Manually checking for duplicate dates and rankings
    const dateStrings = values.days.map(
      (day) => day.date.toISOString().split("T")[0],
    );
    const dateSet = new Set(dateStrings);
    if (dateSet.size !== values.days.length) {
      // We have duplicate dates, find them and set errors
      dateStrings.forEach((date, index) => {
        if (dateStrings.indexOf(date) !== index) {
          // This checks for duplicates
          form.setError(`days.${index}.date`, {
            type: "manual",
            message: "Duplicate dates",
          });
        }
      });
    }

    const rankings = values.days.map((day) => day.ranking);
    const rankingSet = new Set(rankings);
    if (rankingSet.size !== values.days.length) {
      // We have duplicate rankings, find them and set errors
      rankings.forEach((ranking, index) => {
        // Find if there's another index with the same ranking
        const firstIndex = rankings.indexOf(ranking);
        const lastIndex = rankings.lastIndexOf(ranking);
        if (firstIndex !== lastIndex) {
          // This checks for duplicates
          form.setError(`days.${index}.ranking`, {
            type: "manual",
            message: "Duplicate rankings",
          });
        }
      });
    }

    if (Object.keys(form.formState.errors).length > 0) {
      console.log(form.formState.errors);
      return;
    }

    // Clone the data to avoid directly mutating the state
    // Also, convert each date to 'yyyy-mm-dd' format during cloning
    const modifiedData: CreateCalendarValues = {
      ...values,
      days: values.days.map((day) => ({
        ...day,
        date: formatDate(day.date), // Convert Date to string here
      })),
    };

    console.log(modifiedData);
    onCalendarCreate(modifiedData);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Title</FormLabel>
              <FormControl>
                <Input placeholder="Calendar Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Description</FormLabel>
              <FormControl>
                <Input placeholder="Calendar Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* TODO: fix this padding 1 so it aligns with rest of inputs */}
        <div className="max-h-72 overflow-y-scroll p-1">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4">
              {index === 0 ? (
                <>
                  <FormField
                    control={form.control}
                    name={`days.${index}.ranking`}
                    render={({ field }) => (
                      <FormItem className="min-h-[100px]">
                        <FormLabel className="font-semibold">Ranking</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="overflow-visible"
                            {...field}
                            value={field.value.toString()}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value, 10) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`days.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="min-h-[100px]">
                        <FormLabel className="font-semibold">Date</FormLabel>
                        <DatePicker field={field} />
                        <FormMessage />
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
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name={`days.${index}.ranking`}
                    render={({ field }) => (
                      <FormItem className="min-h-[68px]">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value.toString()}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value, 10) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`days.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="min-h-[68px]">
                        <DatePicker field={field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    className="self-start px-2"
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
            // Calculate the current highest ranking
            const currentHighestRanking = fields.reduce(
              (max, field) => Math.max(max, field.ranking),
              0,
            );
            // Append a new day with ranking set to currentHighestRanking + 1
            append({ date: new Date(), ranking: currentHighestRanking + 1 });
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add a day
        </Button>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateCalendar;
