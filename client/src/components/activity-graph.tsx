import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@shared/schema";

type ActivityGraphProps = {
  projects: Project[];
};

export function ActivityGraph({ projects }: ActivityGraphProps) {
  // Group projects by date and count them
  const data = projects.reduce((acc: { [key: string]: number }, project) => {
    const date = project.createdAt.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format for Recharts
  const chartData = Object.entries(data)
    .map(([date, count]) => ({
      date,
      projects: count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Show last 7 days

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-sm text-muted-foreground"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis className="text-sm text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                }}
                labelStyle={{ color: "hsl(var(--popover-foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
