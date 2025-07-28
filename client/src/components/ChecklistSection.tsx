import { PlusIcon } from "lucide-react";
import ChecklistTable from "./ChecklistTable";
import { Button } from "./ui/button";

export type CheckListItem = {
  id: string;
  title: string;
  completed: boolean;
};

const ChecklistSection = () => {
  return (
    <div className="flex w-full flex-col gap-2 py-2">
      <div className="flex items-center justify-between">
        <h4 className="px-1 font-display text-lg font-semibold">Checklists</h4>
        <Button
          variant="ghost"
          className="kh-8 w-8 rounded-lg p-0"
          aria-label="Add new checklist"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      <div className="flex w-full flex-col items-start justify-start">
        <ChecklistTable checklistId="example-checklist" />
      </div>
    </div>
  );
};

export default ChecklistSection;
