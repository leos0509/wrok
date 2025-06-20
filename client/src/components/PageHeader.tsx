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
    <>
      <div className="flex w-full items-center justify-between gap-2 py-2">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold">
            {title || "Page ..."}
          </h1>
          {description && (
            <p className="text-sm font-light text-gray-400 italic">
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
    </>
  );
};

export default PageHeader;
