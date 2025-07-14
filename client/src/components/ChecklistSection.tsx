import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { CheckIcon, EllipsisVerticalIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";

type CheckListItem = {
  id: string;
  title: string;
  completed: boolean;
};

const exampleData: CheckListItem[] = [
  { id: "1", title: "Item 1", completed: false },
  { id: "2", title: "Item 2", completed: true },
  { id: "3", title: "Item 3", completed: false },
];

const ChecklistSection = () => {
  const [items, setItems] = useState<CheckListItem[]>(exampleData);

  const handleCheck = (id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: checked } : item,
      ),
    );
  };

  const columns: ColumnDef<CheckListItem>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: () => 
            <div className="w-full flex items-center justify-between gap-2">
                <span>Checklist 1</span>
                <Button
                    variant="ghost"
                    className="kh-8 w-8 p-0 rounded-lg"
                    aria-label="More options"
                >
                    <EllipsisVerticalIcon className="size-4" />
                </Button>
            </div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              <CustomCheckBox checked={item.completed} onChange={(newChecked) => handleCheck(item.id, newChecked)} />
              <span className="text-wrap">{item.title}</span>
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
    <div className="flex w-full flex-col gap-2 py-2">
      <h4 className="font-display text-lg font-semibold px-1">Checklists</h4>
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
                        "px-4 font-light text-xs size-10",
                        cell.column.id === "description" ? "max-w-32" : "",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChecklistSection;

type CustomCheckBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const CustomCheckBox = ({ checked, onChange }: CustomCheckBoxProps) => {

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("flex items-center justify-center size-4 rounded-full border border-gray-500 bg-transparent hover:cursor-pointer", checked && "bg-primary text-primary-foreground border-primary-foreground")}
        onClick={() => onChange(!checked)}
      >
        {checked && <CheckIcon className="size-2.5" />}
      </div>
    </div>
  );
};
