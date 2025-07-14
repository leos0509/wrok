import { dateRangeToString } from "@/lib/utils";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "./DateRangePicker";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DatePickerInputProps = {
  value?: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onBlur?: () => void;
};

const DatePickerInput = ({
  value,
  onChange,
  placeholder = "Select date range",
  className = "",
  disabled = false,
  onBlur = () => {},
}: DatePickerInputProps & {
  value?: DateRange | null;
  onChange?: (range: DateRange | null) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={dateRangeToString(value) || ""}
          placeholder={placeholder}
          disabled={disabled}
          className={`cursor-pointer ${className}`}
          onClick={() => setOpen(true)}
          onBlur={onBlur}
          readOnly
          type="text"
          autoComplete="off"
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <DateRangePicker
          value={value || undefined}
          onValueChange={(range: DateRange | null | undefined) =>
            onChange(range || undefined)
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerInput;
