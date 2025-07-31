import {
  useDeleteChecklist,
  useUpdateChecklistName,
} from "@/hooks/useChecklist";
import useDebounce from "@/hooks/useDebounce";
import { EllipsisVerticalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChecklistMenu from "./ChecklistMenu";
import { Button } from "./ui/button";

type ChecklistHeaderProps = {
  name: string;
  checklistId: string;
};
const ChecklistHeader = ({ name, checklistId }: ChecklistHeaderProps) => {
  const [checklistName, setChecklistName] = useState(name);
  const [disbaledName, setDisabledName] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateChecklistName } = useUpdateChecklistName();
  const useDebounceName = useDebounce(checklistName, 500);
  const { mutate: deleteChecklist } = useDeleteChecklist(checklistId);

  useEffect(() => {
    if (useDebounceName && useDebounceName.trim() !== "") {
      updateChecklistName({ checklistId, title: useDebounceName });
    }
  }, [useDebounceName, checklistId, updateChecklistName]);

  const handleSelectRename = () => {
    setDisabledName(false);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleBlur = () => {
    setDisabledName(true);
    if (checklistName.trim() === "") {
      setChecklistName("New Checklist");
    }
  };

  const handleDeleteChecklist = () => {
    deleteChecklist();
  };

  return (
    <div className="z-10 flex w-full items-center justify-between gap-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Checklist Name"
        value={checklistName}
        onChange={(e) => setChecklistName(e.target.value)}
        onBlur={handleBlur}
        className="w-full border-none bg-transparent p-0 shadow-none focus:ring-0 focus:outline-none"
        disabled={disbaledName}
      />
      <ChecklistMenu
        onDelete={handleDeleteChecklist}
        onRename={handleSelectRename}
      >
        <Button
          variant="ghost"
          className="kh-8 relative z-50 w-8 rounded-lg p-0"
          aria-label="More options"
        >
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </ChecklistMenu>
    </div>
  );
};

export default ChecklistHeader;
