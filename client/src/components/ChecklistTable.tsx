import {
  useCreateQuickChecklistItem,
  useDeleteChecklistItem,
  useGetChecklistById,
} from "@/hooks/useChecklist";
import { cn } from "@/lib/utils";
import type {
  Checklist,
  ChecklistItem as ChecklistItemType,
} from "@/types/checklist";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Loading from "./Loading";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import ChecklistRow from "./ChecklistRow";

type ChecklistTableProps = {
  checklistId: string;
};

const ChecklistTable = ({ checklistId }: ChecklistTableProps) => {
  const [checklist, setChecklist] = useState<Checklist>();
  const [items, setItems] = useState<ChecklistItemType[]>([]);

  const {
    data: checklistData,
    isSuccess: isChecklistDataSuccess,
    isLoading: isChecklistDataLoading,
  } = useGetChecklistById(checklistId, Boolean(checklistId));

  const { mutate: createQuickChecklistItem } = useCreateQuickChecklistItem();
  const { mutate: deleteChecklistItem } = useDeleteChecklistItem();

  useEffect(() => {
    if (isChecklistDataSuccess && checklistData) {
      setChecklist(checklistData);
      setItems(checklistData.items || []);
    }
  }, [checklistId, isChecklistDataSuccess, checklistData]);

  const handleDelete = useMemo(
    () => (id: string) => {
      const itemExists = items.some((item) => item.id === id);
      if (!itemExists) {
        return;
      }
      deleteChecklistItem({ checklistId, itemId: id });
    },
    [items, checklistId, deleteChecklistItem],
  );

  const handleAddItem = () => {
    if (!checklistId) return;
    createQuickChecklistItem(checklistId);
  };

  const columns: ColumnDef<ChecklistItemType>[] = useMemo(
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
          return <ChecklistRow itemData={item} onDelete={handleDelete} />;
        },
      },
    ],
    [checklist, handleDelete],
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
          {table.getRowModel().rows.length > 0
            ? table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "size-10 px-4 text-xs font-light",
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
            : null}
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="flex items-center justify-center p-0 text-center"
            >
              <Button
                variant="ghost"
                size="iconSm"
                className="w-full rounded-lg p-5"
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
