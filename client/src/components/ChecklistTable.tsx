import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon, Plus, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import type { Checklist, ChecklistItem } from "@/types/checklist";
import { useGetChecklistById } from "@/hooks/useChecklist";
import Loading from "./Loading";

type ChecklistTableProps = {
  checklistId: string;
};

const checklistItems: ChecklistItem[] = [
  {
    id: "1",
    checklistId: "checklist-123",
    title: "Write documentation",
    isChecked: false,
    createdAt: "2025-07-22T10:00:00.000Z",
    updatedAt: "2025-07-22T10:00:00.000Z",
  },
  {
    id: "2",
    checklistId: "checklist-123",
    title: "Fix login bug",
    isChecked: true,
    createdAt: "2025-07-22T09:30:00.000Z",
    updatedAt: "2025-07-22T11:00:00.000Z",
  },
  {
    id: "3",
    checklistId: "checklist-123",
    title: "Refactor sidebar component",
    isChecked: false,
    createdAt: "2025-07-21T16:00:00.000Z",
    updatedAt: "2025-07-21T16:00:00.000Z",
  },
  {
    id: "4",
    checklistId: "checklist-123",
    title: "Update API docs",
    isChecked: true,
    createdAt: "2025-07-20T14:00:00.000Z",
    updatedAt: "2025-07-22T08:00:00.000Z",
  },
];

const ChecklistTable = ({ checklistId }: ChecklistTableProps) => {
  const [checklist, setChecklist] = useState<Checklist>();
  const [items, setItems] = useState<ChecklistItem[]>(checklistItems);

  const {
    data: checklistData,
    isSuccess: isChecklistDataSuccess,
    isLoading: isChecklistDataLoading,
  } = useGetChecklistById(checklistId, Boolean(checklistId));

  useEffect(() => {
    if (isChecklistDataSuccess && checklistData) {
      setChecklist(checklistData);
      setItems(checklistData.items || []);
    }
  }, [checklistId, isChecklistDataSuccess, checklistData]);

  const handleCheck = (id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChecked: checked } : item,
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
        id: Math.random().toString(36).substring(2, 15),
        title: "New Item",
        isChecked: false,
        checklistId: checklistId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  const columns: ColumnDef<ChecklistItem>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: () => (
          <div className="flex w-full items-center justify-between gap-2">
            <span>{checklist ? checklist.title : ""}</span>
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
                checked={item.isChecked}
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
    [checklist],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isChecklistDataLoading) {
    return <Loading />;
  }

  if (!checklist) {
    return <div className="p-4 text-center">Checklist not found</div>;
  }

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
