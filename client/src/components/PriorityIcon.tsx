import type { TaskPriority } from "@/types/task";
import {
    ChevronDownIcon,
    ChevronsDownIcon,
    ChevronsUpIcon,
    ChevronUpIcon,
    MinusIcon,
} from "lucide-react";

type PriorityIconProps = {
  priority: TaskPriority;
};

const PriorityIcon = ({ priority }: PriorityIconProps) => {
  const priorityIconList = {
    LOWEST: <ChevronsDownIcon className="size-4" />,
    LOW: <ChevronDownIcon className="size-4" />,
    MEDIUM: <MinusIcon className="size-4" />,
    HIGH: <ChevronUpIcon className="size-4" />,
    HIGHEST: <ChevronsUpIcon className="size-4" />,
  };

  return priorityIconList[priority] || null;
};

export default PriorityIcon;
