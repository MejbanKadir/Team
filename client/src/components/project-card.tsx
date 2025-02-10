import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trophy } from "lucide-react";
import type { Project } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const completeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/projects/${project.id}/complete`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (progress: number) => {
      const res = await apiRequest(
        "PATCH",
        `/api/projects/${project.id}/progress`,
        { progress }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {project.category}
            </Badge>
            <CardTitle>{project.title}</CardTitle>
          </div>
          <Badge variant="secondary" className="mt-1">
            <Trophy className="h-3 w-3 mr-1" />
            {project.rewardPoints} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {project.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          {project.status === "active" && (
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() =>
                  updateProgressMutation.mutate(Math.min(project.progress + 10, 100))
                }
              >
                Update Progress
              </Button>
              {project.progress === 100 && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => completeMutation.mutate()}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
