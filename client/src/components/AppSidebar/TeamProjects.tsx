import { useGetTeamProjects } from "@/hooks/useTeam";
import { useAppStore } from "@/stores";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import Loading from "../Loading";
import CreateProjectDialog from "../dialog/CreateProjectDialog";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

const TeamProjects = () => {
  const currentTeam = useAppStore((state) => state.currentTeam);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetTeamProjects(
    currentTeam?.id || "",
    !!currentTeam?.id,
  );

  const handleProjectClick = (projectId: string) => {
    navigate({ to: `/dashboard/projects/${projectId}` });
  };

  const renderProjects = () => {
    if (!currentTeam) {
      return (
        <SidebarMenuItem className="text-muted-foreground">
          No team selected
        </SidebarMenuItem>
      );
    }

    if (isLoading) {
      return (
        <SidebarMenuItem>
          <Loading />
        </SidebarMenuItem>
      );
    }

    if (isError) {
      return (
        <SidebarMenuItem className="flex items-center justify-center p-2 text-red-400">
          Error loading projects
        </SidebarMenuItem>
      );
    }
    if (!data || data.length === 0) {
      return (
        <SidebarMenuItem className="flex items-center justify-center p-2 text-muted-foreground">
          No projects available
        </SidebarMenuItem>
      );
    }
    return data.map((project) => (
      <SidebarMenuItem
        key={project.id}
        className="flex items-center justify-between"
      >
        <SidebarMenuButton
          onClick={() => handleProjectClick(project.id)}
          isActive={pathname === `/dashboard/projects/${project.id}`}
        >
          <span className="truncate">{project.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <CreateProjectDialog
        trigger={
          <SidebarGroupAction title="Add Project">
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
        }
      />
      <SidebarGroupContent className="max-h-[200px] overflow-y-auto">
        <SidebarMenu>{renderProjects()}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default TeamProjects;
