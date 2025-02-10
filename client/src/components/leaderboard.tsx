import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal } from "lucide-react";
import type { User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type LeaderboardProps = {
  users: User[];
  title?: string;
};

const rankColors = {
  0: "text-yellow-500",
  1: "text-gray-400",
  2: "text-amber-600",
} as const;

export function Leaderboard({ users, title = "Top Users" }: LeaderboardProps) {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedUsers.map((user, index) => (
            <div key={user.id} className="flex items-center gap-4">
              <div className={`text-lg font-bold ${rankColors[index as keyof typeof rankColors] || ""}`}>
                {index + 1}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{user.name}</span>
                  <Badge variant="secondary">
                    <Medal className="h-3 w-3 mr-1" />
                    {user.points} pts
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}