import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // optional: for conditional class handling
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type ColorSelectProps = {
  value?: string;
  onChange: (value: string) => void;
};

const colors = [
  { label: "Red", value: "#FFD9D9" },
  { label: "Orange", value: "#FFE0CC " },
  { label: "Yellow", value: "#FBFCC3" },
  { label: "Lime", value: "#DDFFC9" },
  { label: "Green", value: "#C1FFC1" },
  { label: "Cyan", value: "#CAFFEF" },
  { label: "Sky Blue", value: "#CEF2FF" },
  { label: "Blue", value: "#CCDCFF" },
  { label: "Indigo", value: "#DDD2FF" },
  { label: "Purple", value: "#E3C2FE" },
  { label: "Pink", value: "#FFDEFA" },
  { label: "Magenta", value: "#FFCBF2" },
];

const ColorSelect = ({ value, onChange }: ColorSelectProps) => {
  const selected = colors.find((c) => c.value === value) || colors[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="justfiy-between w-full items-center gap-0 p-1"
          aria-label={`Selected color: ${selected.label}`}
        >
          <div
            style={{ backgroundColor: selected.value }}
            className="h-full w-full rounded-sm"
          />
          <ChevronDownIcon className="mr-1 ml-2 size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={8} className="w-fit p-2">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => {
            const isSelected = color.value === value;
            return (
              <Button
                variant="ghost"
                key={color.value}
                className={cn(
                  "relative aspect-square rounded-md border border-border transition-all focus:ring-2 focus:ring-ring focus:outline-none",
                  isSelected && "ring-2 ring-ring",
                )}
                style={{ backgroundColor: color.value }}
                onClick={() => onChange(color.value)}
                aria-label={color.label}
              >
                {isSelected && (
                  <CheckIcon className="absolute inset-1 m-auto size-4 text-foreground" />
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorSelect;
