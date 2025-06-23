import { BellIcon, SearchIcon, UserIcon } from "lucide-react";
import { InputWithIcon } from "./InputWithIcon";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type PageHeaderProps = {
  title?: string;
  description?: string;
};

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="flex w-full flex-col gap-2 mb-2">
      <div className="flex w-full items-center justify-between gap-1 py-2">
        <div className="flex max-w-[60%] flex-col gap-1">
          <h1 className="line-clamp-1 font-display text-2xl font-semibold">
            {title || "Page ..."}
          </h1>
          {description && (
            <p className="line-clamp-2 text-xs font-light text-gray-400 italic lg:text-sm">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <InputWithIcon
            icon={SearchIcon}
            iconPosition="left"
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-full"
          />
          <Button variant="outline" size="icon" className="rounded-full p-2">
            <BellIcon className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full p-2">
            <UserIcon className="size-4" />
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default PageHeader;
