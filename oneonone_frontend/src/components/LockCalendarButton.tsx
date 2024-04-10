import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Lock, LockOpen } from "lucide-react";

type Props = { disabled: boolean; onClick: () => void; isLocked: boolean };

const LockCalendarButton = ({ disabled, onClick, isLocked }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button disabled={disabled} onClick={onClick} size="icon">
            {isLocked ? <Lock size={24} /> : <LockOpen size={24} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Finalize Calendar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LockCalendarButton;
