import { useDeleteColumn } from "@/hooks/useColumn";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PenLineIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";

type ColumnMenuProps = {
  columnId: string;
  children: React.ReactNode;
};

const ColumnMenu = ({ children, columnId }: ColumnMenuProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteColumn } = useDeleteColumn();

  const handleDeleteColumn = () => {
    deleteColumn(columnId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-30 p-2">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="xs"
            className="w-full justify-start text-xs"
            onClick={() => {
              setOpen(false);
            }}
          >
            <PenLineIcon className="size-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="xs"
            className="w-full justify-start text-xs"
            onClick={() => {
              handleDeleteColumn();
            }}
          >
            <Trash2Icon className="size-4" />
            <span>Delete</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnMenu;
