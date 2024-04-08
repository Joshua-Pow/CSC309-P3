import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import CreateCalendarButtonContents from "./CreateCalendarButtonContents";
import CreateCalendarForm from "./CreateCalendarForm";
import { CreateCalendarValues } from "@/app/(root)/calendars/page";
import { Button } from "./ui/button";

type Props = {
  isFetchingNextPage: boolean;
  isLoading: boolean;
  createCalendarOpen: boolean;
  setCreateCalendarOpen: (open: boolean) => void;
  onCalendarCreate: (calendarData: CreateCalendarValues) => Promise<void>;
};

const CreateCalendarCard = ({
  isFetchingNextPage,
  isLoading,
  createCalendarOpen,
  setCreateCalendarOpen,
  onCalendarCreate,
}: Props) => {
  return (
    <div className="flex flex-wrap content-center justify-center">
      <Dialog open={createCalendarOpen} onOpenChange={setCreateCalendarOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="group h-auto w-auto"
            size="icon"
            disabled={isFetchingNextPage || isLoading}
          >
            <CreateCalendarButtonContents />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new calendar</DialogTitle>{" "}
            <DialogDescription>
              Input details to create a new calendar to schedule events, click
              submit when done.
            </DialogDescription>
          </DialogHeader>
          <CreateCalendarForm onCalendarCreate={onCalendarCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCalendarCard;
