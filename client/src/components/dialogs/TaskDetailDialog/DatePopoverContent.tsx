import { DateRangePicker } from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import type { DateRange } from "react-day-picker";

type DatePopoverContentProps = {
  startDate: Date | undefined | null;
  dueDate: Date | undefined | null;
  onChangeStartDate: (date: Date | undefined | null) => void;
  onChangeDueDate: (date: Date | undefined | null) => void;
  onClose: () => void;
};

const DatePopoverContent = ({
  startDate,
  dueDate,
  onChangeStartDate,
  onChangeDueDate,
  onClose,
}: DatePopoverContentProps) => {
  const handleClear = () => {
    onChangeStartDate(undefined);
    onChangeDueDate(undefined);
    onClose();
  };

  const handleChange = (value: DateRange | undefined) => {
    if (!value) {
      onChangeStartDate(undefined);
      onChangeDueDate(undefined);
      return;
    }
    onChangeStartDate(value.from);
    onChangeDueDate(value.to);
  };

  const hanleApply = () => {
    onClose();
  };

  return (
    <div className="rounded-xl border bg-popover p-3 text-sm shadow-lg">
      <DateRangePicker
        value={{ from: startDate, to: dueDate } as DateRange}
        onValueChange={handleChange}
      />
      <div className="mt-3 flex items-center justify-between">
        <Button
          onClick={handleClear}
          variant="outline"
          size="sm"
          className="text-xs shadow"
        >
          Clear
        </Button>
        <Button onClick={hanleApply} size="sm" className="text-xs shadow">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default DatePopoverContent;
