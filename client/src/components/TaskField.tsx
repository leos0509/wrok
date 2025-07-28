import React, { useState } from "react";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import DefaultFallback from "./DefaultFallback";

type TaskFieldProps = {
  fieldIcon?: React.ReactNode;
  fieldName: string;
  valueNode?: React.ReactNode | null;
  onRemove?: () => void;
  fallbackNode?: React.ReactNode;
  popoverContent: (onClose: () => void) => React.ReactNode;
};
const TaskField = ({
  fieldIcon,
  fieldName,
  valueNode,
  onRemove,
  fallbackNode = <DefaultFallback />,
  popoverContent,
}: TaskFieldProps) => {
  const [openPopover, setOpenPopover] = useState(false);
  return (
    <div className="grid grid-cols-8 gap-4">
      <h3 className="lg:text-md col-span-3 flex items-center gap-2 text-xs font-semibold">
        {fieldIcon && (
          <span className="text-muted-foreground">{fieldIcon}</span>
        )}
        <span>{fieldName}</span>
      </h3>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "lg:text-md group relative col-span-5 flex items-center rounded-lg p-2 text-xs hover:cursor-pointer hover:bg-accent hover:text-accent-foreground h-8",
              openPopover && "bg-accent text-accent-foreground",
            )}
          >
            {valueNode ? valueNode : fallbackNode}
            {valueNode && onRemove && (
              <Button
                variant="ghost"
                size="iconXs"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-gray-100 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100 hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <XIcon className="size-3" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={4}
          avoidCollisions={false}
          className="z-99"
        >
          {popoverContent(() => setOpenPopover(false))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TaskField;

