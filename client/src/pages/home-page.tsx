import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "@/components/sidebar-nav";
import { Leaderboard } from "@/components/leaderboard";
import { ActivityGraph } from "@/components/activity-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, FolderKanban, Trophy } from "lucide-react";
import type { Project, User } from "@shared/schema";

export default function HomePage() {
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  if (projectsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  const activeProjects = projects?.filter((p) => p.status === "active") || [];
  const completedProjects = projects?.filter((p) => p.status === "completed") || [];
  const totalPoints = users?.reduce((sum, user) => sum + user.points, 0) || 0;

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users?.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Points Earned
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPoints}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-8">
            {projects && <ActivityGraph projects={projects} />}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedProjects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.category}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        +{project.rewardPoints} pts
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {users && <Leaderboard users={users} />}
          </div>
        </div>
      </div>
    </div>
  );
}