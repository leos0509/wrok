import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon, PinIcon, XIcon } from "lucide-react";

type TaskDetailHeaderProps = {
    onClose: () => void;
};

const TaskDetailHeader = ({onClose}: TaskDetailHeaderProps) => {
  return (
    <div className="flex h-fit w-full items-center justify-center gap-2 border-r border-b bg-secondary px-4 py-3">
      <div className="w-full text-sm font-semibold text-muted-foreground">
        <span className="rounded-md p-1 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground">
          Apollo
        </span>{" "}
        /{" "}
        <span className="rounded-md p-1 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground">
          To Do
        </span>
      </div>
      {/* BUTTONS */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="iconSm" className="rounded-lg">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
        <Button variant="ghost" size="iconSm" className="rounded-lg">
          <PinIcon className="size-4" />
        </Button>
        <Button variant="ghost" size="iconSm" className="rounded-lg" onClick={() => onClose()}>
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskDetailHeader;
