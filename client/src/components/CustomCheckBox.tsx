import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type CustomCheckBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const CustomCheckBox = ({ checked, onChange }: CustomCheckBoxProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex size-4 items-center justify-center rounded-full border border-gray-500 bg-transparent hover:cursor-pointer",
          checked &&
            "border-primary-foreground bg-primary text-primary-foreground",
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && <CheckIcon className="size-2.5" />}
      </div>
    </div>
  );
};

export default CustomCheckBox;
