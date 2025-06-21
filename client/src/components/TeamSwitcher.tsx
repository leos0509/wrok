import {
  CheckIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { useGetUserTeams } from "@/hooks/useUser";
import { useAppStore } from "@/stores";
import Loading from "./Loading";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import CreateTeamDialog from "./dialog/CreateTeamDialog";

const TeamSwitcher = () => {
  const user = useAppStore((state) => state.user);
  const currentTeam = useAppStore((state) => state.currentTeam);
  const setCurrentTeam = useAppStore((state) => state.setCurrentTeam);

  const {
    data: teams,
    isLoading,
    isError,
  } = useGetUserTeams(user?.id || "", !!user?.id);

  useEffect(() => {
    if (teams && teams.length > 0) {
      const matchedTeam = teams.find((t) => t.id === currentTeam?.id);
      const defaultTeam = matchedTeam || teams[0];

      if (!matchedTeam || currentTeam?.id !== defaultTeam.id) {
        setCurrentTeam(defaultTeam);
      }
    }
  }, [teams, currentTeam?.id, setCurrentTeam]);

  if (isLoading) return <Loading />;
  if (isError) {
    toast.error("Failed to load teams");
    return <div className="p-2 text-red-400">Error loading teams</div>;
  }

  if (!teams || teams.length === 0) {
    return <div className="p-2 text-muted-foreground">No teams available</div>;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sidebarTeam"
              className="flex w-full items-center justify-between"
            >
              {currentTeam && (
                <>
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="text-size-foreground rounded-md bg-sidebar-primary p-2">
                      <UsersIcon className="size-4" />
                    </div>
                    <span className="line-clamp-1 truncate font-display">{currentTeam.name}</span>
                  </div>
                  <ChevronsUpDownIcon className="mx-2 size-4 shrink-0" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="flex w-64 flex-col gap-1 p-3"
            align="start"
            sideOffset={8}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-muted-foreground">Teams</span>
              <CreateTeamDialog
                trigger={
                  <PlusIcon className="size-4 cursor-pointer text-sidebar-primary" />
                }
              />
            </div>
            {teams.map((team) => (
              <Button
                key={team.id}
                variant="ghost"
                size="sidebarTeam"
                className="flex w-full items-center justify-between"
                onClick={() => setCurrentTeam(team)}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div className="rounded-md bg-sidebar-primary p-2">
                    <UsersIcon className="text-size-foreground size-4" />
                  </div>
                  <span className="line-clamp-1 truncate text-left">
                    {team.name}
                  </span>
                </div>

                {team.id === currentTeam?.id && (
                  <CheckIcon className="mx-2 size-4 shrink-0 text-sidebar-primary" />
                )}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default TeamSwitcher;
