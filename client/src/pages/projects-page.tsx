import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "@/components/sidebar-nav";
import { ProjectCard } from "@/components/project-card";
import { Loader2 } from "lucide-react";
import type { Project } from "@shared/schema";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  const activeProjects = projects?.filter((p) => p.status === "active") || [];
  const completedProjects = projects?.filter((p) => p.status === "completed") || [];

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Projects</h1>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Projects</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}