import { cn } from "@/lib/utils";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon, Plus, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import type { CheckListItem } from "./ChecklistSection";
import CustomCheckBox from "./CustomCheckBox";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

type ChecklistTableProps = {
  checklistId: string;
};

const exampleData: CheckListItem[] = [
  { id: "1", title: "Item 1", completed: false },
  { id: "2", title: "Item 2", completed: true },
  { id: "3", title: "Item 3", completed: false },
];

const ChecklistTable = ({ checklistId }: ChecklistTableProps) => {
  console.log("ChecklistTable rendered for checklistId:", checklistId);
  const [items, setItems] = useState<CheckListItem[]>(exampleData);

  const handleCheck = (id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: checked } : item,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "New Item",
        completed: false,
      },
    ]);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleValueChange = (id: string, newValue: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: newValue } : item,
      ),
    );
  };

  const handleOnBlur = (id: string, newValue: string) => {
    if (newValue.trim() === "") {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: "New Item" } : item,
        ),
      );
    }
  };

  const columns: ColumnDef<CheckListItem>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: () => (
          <div className="flex w-full items-center justify-between gap-2">
            <span>Checklist 1</span>
            <Button
              variant="ghost"
              className="kh-8 w-8 rounded-lg p-0"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="group relative flex items-center gap-2 text-xs">
              <CustomCheckBox
                checked={item.completed}
                onChange={(newChecked) => handleCheck(item.id, newChecked)}
              />
              <Input
                value={item.title}
                onChange={(e) => handleValueChange(item.id, e.target.value)}
                className="h-8 flex-1 border-none bg-transparent shadow-none focus:ring-0 md:text-xs"
                onBlur={(e) => handleOnBlur(item.id, e.target.value)}
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
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border/80">
      <Table className="bg-background">
        <TableHeader className="bg-secondary text-secondary-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-12 px-4 font-display leading-[100%] font-semibold"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "size-10 px-4 text-xs font-light",
                      cell.column.id === "description" ? "max-w-32" : "",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No tasks found
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="flex items-center justify-center p-0 text-center"
            >
              <Button
                variant="ghost"
                size="iconSm"
                className="w-full rounded-lg p-4"
                onClick={handleAddItem}
              >
                <Plus className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ChecklistTable;
