import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      <Loader2Icon className="size-4 animate-spin" />
      <span>Loading ...</span>
    </div>
  );
};

export default Loading;
