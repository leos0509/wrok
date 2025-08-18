import { useGetColumnTasks } from "@/hooks/useColumn";
import { useIsOverflow } from "@/hooks/useIsOverflow";
import { SortableContext } from "@dnd-kit/sortable";
import Loading from "../Loading";
import TaskCardWrapper from "./wrappers/TaskCardWrapper";

type ColumnTaskListProps = {
  columnId: string;
};

const ColumnTaskList = ({ columnId }: ColumnTaskListProps) => {
  const { data: tasks = [], isLoading, error } = useGetColumnTasks(columnId);
  const { ref, isOverflow } = useIsOverflow();

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Error loading tasks
      </div>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`scrollbar-thin flex max-h-full w-full flex-grow flex-col gap-2 overflow-y-auto rounded-md pb-1 scrollbar-thumb-gray-400 scrollbar-track-transparent`}
      data-testid="task-list"
      style={{ paddingRight: isOverflow ? "0.3rem" : "0" }}
    >
      <div className="flex h-full w-full flex-col gap-2">
        <SortableContext items={tasks.map((task) => task.id)}>
          {tasks.map((task) => (
            <TaskCardWrapper key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ColumnTaskList;
