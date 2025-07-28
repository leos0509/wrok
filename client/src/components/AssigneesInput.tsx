import type { User } from "@/types/user";
import UserAvatar from "./UserAvatar";

type AssigneesInputProps = {
  assignees: User[];
};

const AssigneesInput = ({ assignees }: AssigneesInputProps) => {
  if (assignees.length > 2)
    return (
      <div className="flex w-full items-center justify-start">
        {assignees.slice(0, 2).map((assignee) => (
          <UserAvatar key={assignee.id} user={assignee} isShorten={true} />
        ))}
        <div className="-ml-1 flex items-center justify-center rounded-full border-2 border-background">
          <div className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            <span className="text-[10px] leading-[100%]">
              + {assignees.length - 2}
            </span>
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex w-full items-center justify-start">
      {assignees.map((assignee) => (
        <UserAvatar key={assignee.id} user={assignee} isShorten={true} />
      ))}
    </div>
  );
};

export default AssigneesInput;
