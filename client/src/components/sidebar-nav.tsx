import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  LogOut,
  User,
  Shield,
} from "lucide-react";

const commonLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/users", label: "Users", icon: Users },
];

const adminLinks = [
  { href: "/admin", label: "Admin Panel", icon: Shield },
];

export function SidebarNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const links = [...commonLinks, ...(user?.role === "admin" ? adminLinks : [])];

  return (
    <div className="flex h-screen flex-col border-r bg-sidebar">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-sidebar-foreground">
          Team Dashboard
        </h1>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    location === link.href && "bg-sidebar-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60">{user?.role}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}