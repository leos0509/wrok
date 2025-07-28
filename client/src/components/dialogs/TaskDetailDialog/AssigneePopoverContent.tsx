import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import UserAvatar from "@/components/UserAvatar";
import { useGetProjectMembers } from "@/hooks/useProject";
import { useUpdateTaskAssignees } from "@/hooks/useTask";
import type { User } from "@/types/user";
import { useParams } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type AssigneePopoverContentProps = {
  taskId: string;
  value: User[];
  onChange: (assignees: User[]) => void;
};

const AssigneePopoverContent = ({
  taskId,
  value = [],
  onChange,
}: AssigneePopoverContentProps) => {
  const { projectId } = useParams({
    from: "/dashboard/_layout/projects/$projectId",
  });

  const [search, setSearch] = useState("");

  const { mutate: updateTaskAssignees } = useUpdateTaskAssignees();
  const { data: availableAssignees, isLoading } = useGetProjectMembers(
    projectId,
    Boolean(projectId),
  );

  const handleToggleAssignee = (assignee: User) => {
    const isCurrentlyAssigned = value.some((u) => u.id === assignee.id);
    const updatedList = isCurrentlyAssigned
      ? value.filter((u) => u.id !== assignee.id)
      : [...value, assignee];

    updateTaskAssignees({
      taskId,
      assignees: updatedList.map((u) => u.id),
    });

    onChange(updatedList);
  };

  useEffect(() => {
    if (value.length === 0) {
      updateTaskAssignees({ taskId, assignees: [] });
    }
  }, [value, taskId, updateTaskAssignees]);

  const filteredAssignees = availableAssignees?.filter((assignee) =>
    `${assignee.firstName} ${assignee.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="relative flex min-w-48 flex-col gap-2 rounded-xl border bg-background p-2 text-xs shadow-md">
      <Input
        type="text"
        placeholder="Search assignee"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sticky top-0 z-10 rounded-lg border bg-background px-2 py-1 md:text-xs h-8"
      />

      <div className="scrollbar-thin max-h-48 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-transparent flex flex-col gap-0.5">
        {isLoading ? (
          <Loading />
        ) : filteredAssignees?.length ? (
          filteredAssignees.map((assignee) => {
            const isSelected = value.some((u) => u.id === assignee.id);
            return (
              <AssigneeButton
                key={assignee.id}
                assignee={assignee}
                isSelected={isSelected}
                onClick={handleToggleAssignee}
              />
            );
          })
        ) : (
          <div className="p-2 text-muted-foreground">No matching assignees</div>
        )}
      </div>
    </div>
  );
};

export default AssigneePopoverContent;

type AssigneeButtonProps = {
  assignee: User;
  onClick: (assignee: User) => void;
  isSelected: boolean;
};

const AssigneeButton = ({
  assignee,
  onClick,
  isSelected,
}: AssigneeButtonProps) => {
  return (
    <button
      className="relative flex w-full items-center gap-2 rounded-md p-1 text-left hover:bg-accent hover:text-accent-foreground"
      onClick={() => onClick(assignee)}
    >
      <UserAvatar user={assignee} />
      <span className="line-clamp-1">
        {assignee.firstName} {assignee.lastName}
      </span>
      {isSelected && (
        <CheckIcon className="absolute top-1/2 right-2 size-4 -translate-y-1/2 text-primary" />
      )}
    </button>
  );
};
