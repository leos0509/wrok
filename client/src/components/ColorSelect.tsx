import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // optional: for conditional class handling
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type ColorSelectProps = {
  value?: string;
  onChange: (value: string) => void;
};

const colors = [
  { label: "Red", value: "#FF6961" },
  { label: "Orange", value: "#FFD580" },
  { label: "Yellow", value: "#FDFD96" },
  { label: "Lime", value: "#B2FBA5" },
  { label: "Green", value: "#77DD77" },
  { label: "Cyan", value: "#B2FFFF" },
  { label: "Sky Blue", value: "#AEC6CF" },
  { label: "Blue", value: "#89CFF0" },
  { label: "Indigo", value: "#C3B1E1" },
  { label: "Purple", value: "#D6A4E7" },
  { label: "Magenta", value: "#F49AC2" },
  { label: "Pink", value: "#FFB6C1" },
];

const ColorSelect = ({ value, onChange }: ColorSelectProps) => {
  const selected = colors.find((c) => c.value === value) || colors[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="justfiy-between w-full items-center p-1 gap-0"
          aria-label={`Selected color: ${selected.label}`}
        >
          <div
            style={{ backgroundColor: selected.value }}
            className="w-full h-full rounded-sm"
          />
          <ChevronDownIcon className="size-4 text-muted-foreground ml-2 mr-1" />
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
