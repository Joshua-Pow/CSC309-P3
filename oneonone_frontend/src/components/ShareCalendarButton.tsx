import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Link } from "lucide-react";

type Props = { disabled: boolean; onClick: () => void };

const ShareCalendarButton = ({ disabled, onClick }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            disabled={disabled}
          >
            <Link size={24} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share Calendar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShareCalendarButton;
