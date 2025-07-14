import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

type DateRangePickerProps = {
  value?: DateRange;
  onValueChange: (range: DateRange | undefined) => void;
};

export function DateRangePicker({
  value,
  onValueChange,
}: DateRangePickerProps) {
  return (
    <Calendar
      mode="range"
      defaultMonth={value?.from}
      selected={value}
      onSelect={onValueChange}
      className="rounded-lg border shadow-sm"
    />
  );
}
