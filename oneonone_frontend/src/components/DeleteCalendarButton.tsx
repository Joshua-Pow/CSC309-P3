import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type Props = { disabled: boolean; onClick: () => void };

const DeleteCalendarButton = ({ disabled, onClick }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            disabled={disabled}
            onClick={onClick}
            size="icon"
          >
            <Trash2 size={24} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Calendar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DeleteCalendarButton;
