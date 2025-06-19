import * as React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { Input } from "./ui/input";

interface InputWithIconProps extends React.ComponentProps<"input"> {
  icon: LucideIcon;
  iconPosition?: "left" | "right";
  iconFunction?: () => void;
  className?: string;
}

export function InputWithIcon({
  icon: Icon,
  iconPosition = "left",
  iconFunction,
  className,
  ...props
}: InputWithIconProps) {
  return (
    <div className="relative w-full">
      {iconPosition === "left" && (
        <Icon
          className={cn(
            "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground",
            iconFunction &&
              "cursor-pointer transition-colors duration-100 ease-in-out hover:text-primary",
          )}
          onClick={iconFunction}
        />
      )}
      <Input
        className={cn(
          iconPosition && iconPosition === "left" ? "pl-10" : "pr-3",
          className,
        )}
        {...props}
      />
      {iconPosition === "right" && (
        <Icon
          className={cn(
            "absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground",
            iconFunction &&
              "cursor-pointer transition-colors duration-100 ease-in-out hover:text-primary",
          )}
          onClick={iconFunction}
        />
      )}
    </div>
  );
}
