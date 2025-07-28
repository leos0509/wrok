import { useState } from "react";

type TimeEstPopoverContentProps = {
  value: number | undefined | null;
  onChange: (value: number) => void;
  onClose: () => void;
};

const TimeEstPopoverContent = ({
  value,
  onChange,
  onClose
}: TimeEstPopoverContentProps) => {
  const [tempValue, setTempValue] = useState<string>(value?.toString() ?? "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleOnChange();
      onClose();
    }
  };

  const handleOnChange = () => {
    const parsed = parseFloat(tempValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      setTempValue("");
    }
    onClose();
  };

  return (
    <div className="flex w-fit min-w-48 flex-col gap-2 rounded-xl border bg-background p-2 text-xs shadow-md">
      <div className="flex flex-col items-start justify-between gap-1">
        <h3 className="p-1 font-semibold text-nowrap">Time Estimated</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            autoFocus={false}
            value={tempValue}
            className="h-7 w-full max-w-20 rounded-lg border px-2 py-1 text-xs outline-none"
            placeholder="Times"
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleOnChange}
            onKeyDown={handleKeyDown}
          />
          <span className="pr-2">{value && value > 1 ? "hours" : "hour"}</span>
        </div>
      </div>
    </div>
  );
};

export default TimeEstPopoverContent;
