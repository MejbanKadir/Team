import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "@/components/sidebar-nav";
import { UserCard } from "@/components/user-card";
import { Leaderboard } from "@/components/leaderboard";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { User } from "@shared/schema";
import { useState } from "react";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  const filteredUsers = users?.filter((user) => {
    return user.name.toLowerCase().includes(search.toLowerCase()) ||
           user.username.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Users</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-8">
              <div className="flex gap-4">
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredUsers?.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>

            <div>
              {users && <Leaderboard users={users} title="Leaderboard" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}