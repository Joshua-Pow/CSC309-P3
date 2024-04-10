import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { PencilIcon } from "lucide-react";

type Props = { disabled: boolean; onClick: () => void };

const EditCalendarButton = ({ disabled, onClick }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            disabled={disabled}
            onClick={onClick}
          >
            <PencilIcon size={24} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit Calendar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EditCalendarButton;
