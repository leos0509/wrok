import type { ChecklistItem } from "@/types/checklist";
import { useEffect, useState } from "react";
import CustomCheckBox from "./CustomCheckBox";
import { Input } from "./ui/input";
import { Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useUpdateChecklistItem } from "@/hooks/useChecklistItem";
import useDebounce from "@/hooks/useDebounce";
import { useDeleteChecklistItem } from "@/hooks/useChecklist";

type ChecklistRowProps = {
  itemData: ChecklistItem;
};

const ChecklistRow = ({ itemData }: ChecklistRowProps) => {
  const [item, setItem] = useState<ChecklistItem>(itemData);

  const { mutate: updateItem } = useUpdateChecklistItem();
  const { mutate: deleteChecklistItem } = useDeleteChecklistItem();

  const debounceChecklistItem = useDebounce<ChecklistItem>(item, 500);

  useEffect(() => {
    if (
      debounceChecklistItem.id &&
      JSON.stringify(debounceChecklistItem) !== JSON.stringify(itemData)
    ) {
      updateItem({
        itemId: debounceChecklistItem.id,
        title: debounceChecklistItem.title,
        isChecked: debounceChecklistItem.isChecked,
      });
    }
  }, [debounceChecklistItem, updateItem, itemData]);

  const handleCheck = (checked: boolean) => {
    setItem((prev) => ({ ...prev, isChecked: checked }));
  };

  const handleValueChange = (value: string) => {
    setItem((prev) => ({ ...prev, title: value }));
  };
  
  const handleDelete = (id: string) => {
    deleteChecklistItem({ checklistId: itemData.checklistId, itemId: id });
  }

  const handleOnBlur = (value: string) => {
    if (value.trim() === "") {
      setItem((prev) => ({ ...prev, title: "New Item" }));
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
        onClick={() => handleDelete(item.id)}
        aria-label="Delete item"
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
};

export default ChecklistRow;
