import PriorityIcon from "@/components/PriorityIcon";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types/task";

type PriorityPopoverContentProps = {
  value: TaskPriority | undefined | null;
  onChange: (value: TaskPriority) => void;
  onClose: () => void;
};

const PriorityPopoverContent = ({
  value,
  onChange,
  onClose
}: PriorityPopoverContentProps) => {
  const priorityOptions = [
    { label: "Highest", value: "HIGHEST" },
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
    { label: "Lowest", value: "LOWEST" },
  ];

  const handlePriorityChange = (status: TaskPriority) => {
    onChange(status);
    onClose();
  };

  return (
    <div className="flex min-w-48 flex-col gap-2 rounded-xl border bg-background p-2 text-xs shadow-md">
      <div className="flex flex-col gap-1">
        {priorityOptions.map((priority, index) => (
          <button
            key={index}
            className={cn(
              "flex w-full items-center gap-1 rounded-md p-2 text-left",
              value === priority.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => handlePriorityChange(priority.value as TaskPriority)}
          >
            <PriorityIcon priority={priority.value as TaskPriority} />
            <span>{priority.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriorityPopoverContent;
