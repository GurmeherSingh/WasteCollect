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

export default function HouseholdDashboard() {
  const { user } = useAuth();
  
  const { data: pickups } = useQuery({
    queryKey: ["/api/pickups/user"],
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Household Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Reward Points:</span>
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
              <CardTitle>Recent Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickups?.map((pickup) => (
                    <TableRow key={pickup.id}>
                      <TableCell>
                        {new Date(pickup.scheduledDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{pickup.wasteType}</TableCell>
                      <TableCell>{pickup.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
