import { Loader2Icon } from "lucide-react";

const TaskCardSkeleton = () => {
  return (
    <div className="bg-gray justify-center flex h-12 w-full items-center bg-gray-200">
      <Loader2Icon className="size-4 animate-spin" />
    </div>
  );
};

export default TaskCardSkeleton;
