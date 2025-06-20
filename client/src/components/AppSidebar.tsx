import { useAppStore } from "@/stores";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  HelpCircleIcon,
  HouseIcon,
  LogOutIcon,
  SettingsIcon,
  SquareKanbanIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const sidebarDashboardGroup = [
  {
    label: "Home",
    icon: HouseIcon,
    path: "/dashboard",
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    path: "/dashboard/settings",
  },
];

const AppSidebar = () => {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const signout = useAppStore.getState().signout;
  const navigate = useNavigate();

  const handleSignout = () => {
    signout();
    navigate({ to: "/signin" });
  };

  return (
    <Sidebar className="p-2" collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton
          className="font-mono text-lg font-semibold"
          size="default"
        >
          <SquareKanbanIcon />
          <span className="tracking-wider">WROK</span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Dashboard</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarDashboardGroup.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    data-active={pathname === item.path}
                    onClick={() => navigate({ to: item.path })}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircleIcon />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignout}>
              <LogOutIcon className="rotate-180" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
