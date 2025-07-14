import { useGetColumnTasks } from "@/hooks/useColumn";
import type { Column } from "@/types/column";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Accordion, AccordionItem, AccordionTrigger } from "../ui/accordion";
import ColumnTaskTable from "./ColumnTaskTable";

type ColumnAccordionProps = {
  col: Column;
};

const ColumnAccordion = ({ col }: ColumnAccordionProps) => {
  const { data: tasks, isLoading: isTasksLoading } = useGetColumnTasks(col.id);
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value={col.id}
        className="group rounded-xl bg-secondary shadow-md"
      >
        <AccordionTrigger className="rounded-xl bg-background px-4 group-data-[state=open]:bg-accent group-data-[state=open]:text-accent-foreground hover:bg-accent hover:text-accent-foreground hover:no-underline">
          {col.name}
        </AccordionTrigger>
        <AccordionContent>
          <div className="max-h-[400px] min-h-32 w-full overflow-x-auto overflow-y-auto p-2">
            {isTasksLoading ? (
              <div className="py-2 text-muted-foreground">Loading tasks...</div>
            ) : tasks && tasks.length > 0 ? (
              <div className="overflow-hidden rounded-lg">
                <ColumnTaskTable tasks={tasks} />
              </div>
            ) : (
              <div className="py-2 text-muted-foreground">
                No tasks in this column
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ColumnAccordion;


