import { useCreateQuickTask } from "@/hooks/useTask";
import type { Column } from "@/types/column";
import { EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";
import ColumnTaskList from "../ColumnTaskList";
import ColumnMenu from "../ColumnMenu";

type SortableColumnProps = {
  column: Column;
};

const ColumnOverlay = ({ column }: SortableColumnProps) => {
  const { mutate: createQuickTaks } = useCreateQuickTask();

  const hanldeCreateTask = () => {
    createQuickTaks({
      projectId: column.projectId,
      columnId: column.id,
    });
  };

  return (
    <div className="relative flex h-full w-[250px] shrink-0 flex-col items-start justify-start gap-2 overflow-hidden rounded-lg bg-secondary p-2 text-secondary-foreground shadow-sm">
      <div className="flex w-full items-center justify-between gap-1 p-1">
        <div className="w-full overflow-hidden">
          <h2 className="line-clamp-1 w-full font-semibold">{column.name}</h2>
        </div>
        <ColumnMenu columnId={column.id}>
          <Button variant="ghost" size="iconSm" className="rounded-lg p-1">
            <EllipsisVerticalIcon className="size-3" />
          </Button>
        </ColumnMenu>
      </div>
      <ColumnTaskList columnId={column.id} />
      <Button className="w-full" onClick={hanldeCreateTask}>
        <PlusIcon className="size-4" />
        <span>Add Task</span>
      </Button>
    </div>
  );
};

export default React.memo(ColumnOverlay);
