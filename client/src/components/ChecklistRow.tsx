import type { ChecklistItem } from "@/types/checklist";
import { useState } from "react";
import CustomCheckBox from "./CustomCheckBox";
import { Input } from "./ui/input";
import { Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";

type ChecklistRowProps = {
  itemData: ChecklistItem;
  onDelete: (id: string) => void;
};

const ChecklistRow = ({ itemData, onDelete }: ChecklistRowProps) => {
  const [item, setItem] = useState<ChecklistItem>(itemData);

  const handleCheck = (checked: boolean) => {
    setItem((prev) => ({ ...prev, isChecked: checked }));
  };

  const handleValueChange = (value: string) => {
    setItem((prev) => ({ ...prev, title: value }));
  };

  const handleOnBlur = (value: string) => {
    if (value.trim() === "") {
      setItem((prev) => ({ ...prev, title: itemData.title }));
    } else {
      setItem((prev) => ({ ...prev, title: value }));
    }
  };
  
  return (
    <div className="group relative flex items-center gap-2 text-xs">
      <CustomCheckBox
        checked={item.isChecked}
        onChange={(newChecked) => handleCheck(newChecked)}
      />
      <Input
        value={item.title}
        onChange={(e) => handleValueChange(e.target.value)}
        className="h-8 flex-1 border-none bg-transparent shadow-none focus:ring-0 md:text-xs"
        onBlur={(e) => handleOnBlur(e.target.value)}
      />
      <Button
        variant="ghost"
        className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-100"
        onClick={() => onDelete(item.id)}
        aria-label="Delete item"
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
};

export default ChecklistRow;
