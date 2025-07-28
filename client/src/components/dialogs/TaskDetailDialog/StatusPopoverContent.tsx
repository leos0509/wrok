import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/task";

type StatusPopoverContentProps = {
  value: TaskStatus | undefined | null;
  onChange: (value: TaskStatus) => void;
  onClose: () => void;
};

const StatusPopoverContent = ({
  value,
  onChange,
  onClose
}: StatusPopoverContentProps) => {
  const statusOptions = [
    { label: "To Do", value: "TO_DO" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "Completed" },
  ];

  const handleStatusChange = (status: TaskStatus) => {
    onChange(status);
    onClose();
  };

  return (
    <div className="flex min-w-48 flex-col gap-2 rounded-xl border bg-background p-2 text-xs shadow-md">
      {/* <h3 className="px-2 py-1 font-semibold text-sm">Change Status</h3> */}
      <div className="flex flex-col gap-1">
        {statusOptions.map((status, index) => (
          <button
            key={index}
            className={cn(
              "w-full rounded-md p-2 text-left",
              value === status.value ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => handleStatusChange(status.value as TaskStatus)}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusPopoverContent;
