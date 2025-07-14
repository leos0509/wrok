import React from "react";

type TaskFieldProps = {
  fieldIcon?: React.ReactNode;
  fieldName: string;
  valueNode?: React.ReactNode | null;
  fallbackNode?: React.ReactNode;
};
const TaskField = ({
  fieldIcon,
  fieldName,
  valueNode,
  fallbackNode = DefaultFallback,
}: TaskFieldProps) => {
  return (
    <div className="grid grid-cols-8 gap-4">
      <h3 className="text-xs lg:text-md col-span-3 font-semibold flex items-center gap-2">
        {fieldIcon && <span className="text-muted-foreground">{fieldIcon}</span>}
        <span>{fieldName}</span>
      </h3>
      <div className="col-span-5 flex items-center text-xs lg:text-md">
        {valueNode ? valueNode : fallbackNode}
      </div>
    </div>
  );
};

export default TaskField;

const DefaultFallback = <span className="text-muted-foreground">Empty</span>;
