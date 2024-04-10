import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CustomCalendar from "./CustomCalendar";
import {
  Download,
  Link,
  LockOpen,
  PencilIcon,
  PlusIcon,
  Trash2,
} from "lucide-react";

const CreateCalendarButtonContents = () => {
  return (
    <>
      <div className="relative text-left">
        <div className="absolute inset-0 z-10 rounded-lg bg-background/50  group-hover:bg-accent/50"></div>
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Example Title</CardTitle>
            <CardDescription>Example Description</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomCalendar />
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="secondary" size="icon">
              <Trash2 size={24} />
            </Button>
            <Button variant="outline" size="icon">
              <Link size={24} />
            </Button>
            <Button size="icon" variant="outline">
              <Download size={24} />
            </Button>
            <Button size="icon" variant="outline">
              <PencilIcon size={24} />
            </Button>
            <Button size="icon">
              <LockOpen size={24} />
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="absolute z-20 flex h-10 w-10 items-center justify-center bg-background/50 group-hover:bg-accent/50 group-hover:text-accent-foreground">
        <PlusIcon strokeWidth={2} size={36} />
      </div>
    </>
  );
};

export default CreateCalendarButtonContents;
