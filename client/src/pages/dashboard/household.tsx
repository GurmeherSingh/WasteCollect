import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Calendar } from "lucide-react";

export default function HouseholdDashboard() {
  const { user } = useAuth();

  const { data: pickups } = useQuery({
    queryKey: ["/api/pickups/user"],
  });

  const { data: pointHistory } = useQuery({
    queryKey: ["/api/points/history"],
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Household Dashboard</h1>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600">Points:</span>
            <span className="font-semibold">{user?.rewardPoints}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Pickup</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>Schedule New Pickup</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements?.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {achievement.type.split('_').join(' ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        +{achievement.pointsAwarded} points
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
                {(!achievements || achievements.length === 0) && (
                  <p className="text-sm text-gray-600">
                    Complete pickups to unlock achievements!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointHistory?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="font-medium">
                      +{transaction.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}