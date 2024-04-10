import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

type Props = { disabled: boolean; onClick: () => void };

const DownloadCalendarButton = ({ disabled, onClick }: Props) => {
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
            <Download size={24} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download Calendar .ICS</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownloadCalendarButton;
