import { PopoverContent } from "@radix-ui/react-popover";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { PenLineIcon, Trash2Icon } from "lucide-react";

type ChecklistMenuProps = {
  onDelete: () => void;
  onRename: () => void;
  children: React.ReactNode;
};

const ChecklistMenu = ({
  onDelete,
  onRename,
  children,
}: ChecklistMenuProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="z-50">
        <div className="flex flex-col gap-2 bg-background p-2 shadow rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRename()}
            className="flex w-full items-center justify-start gap-2"
          >
            <PenLineIcon className="size-4" />
            <span>Rename</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete()}
            className="flex w-full items-center justify-start gap-2 text-foreground hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2Icon className="size-4" />
            <span>Delete</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChecklistMenu;
