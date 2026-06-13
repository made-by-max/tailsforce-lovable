import { Link, useRouterState } from "@tanstack/react-router";
import {
  PackageOpen, Building2, Truck, Stethoscope,
  Users, Home, PawPrint, GraduationCap,
  Megaphone, CalendarDays, HeartHandshake, Share2, Mail,
  Settings,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

const intake: Item[] = [
  { title: "Incoming Pets", url: "#", icon: PackageOpen },
  { title: "Shelter Partners", url: "#", icon: Building2 },
  { title: "Transit Partners", url: "#", icon: Truck },
  { title: "Vet Partners", url: "#", icon: Stethoscope },
];
const adoption: Item[] = [
  { title: "Adoption Coordinators", url: "#", icon: Users },
  { title: "Foster Home Database", url: "#", icon: Home },
  { title: "Current Pets", url: "/", icon: PawPrint },
  { title: "Graduates", url: "#", icon: GraduationCap },
];
const communication: Item[] = [
  { title: "Community Outreach", url: "#", icon: Megaphone },
  { title: "Events", url: "#", icon: CalendarDays },
  { title: "Donors", url: "#", icon: HeartHandshake },
  { title: "Social Media", url: "#", icon: Share2 },
  { title: "Newsletter", url: "#", icon: Mail },
];

function Group({ label, items, currentPath }: { label: string; items: Item[]; currentPath: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = item.url !== "#" && currentPath === item.url;
            const content = (
              <>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </>
            );
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active}>
                  {item.url === "#" ? (
                    <a href="#" onClick={(e) => e.preventDefault()}>{content}</a>
                  ) : (
                    <Link to={item.url}>{content}</Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PawPrint className="h-4 w-4" />
          </div>
          <span className="font-semibold">Pawfolio</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Group label="Intake" items={intake} currentPath={currentPath} />
        <Group label="Adoption" items={adoption} currentPath={currentPath} />
        <Group label="Communication" items={communication} currentPath={currentPath} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" onClick={(e) => e.preventDefault()} className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/64?img=47" alt="Avery Morgan" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-sm font-medium">Avery Morgan</span>
                  <span className="truncate text-xs text-muted-foreground">averymorgan@pawfolio.org</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
