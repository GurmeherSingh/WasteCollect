
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function CollectorDashboard() {
  const { data: assignedPickups } = useQuery({
    queryKey: ["/api/pickups/collector"],
  });

  const { data: availablePickups } = useQuery({
    queryKey: ["/api/pickups/available"],
  });

  const updatePickupStatus = async (id: number, status: string) => {
    await apiRequest("PATCH", `/api/pickups/${id}/status`, { status });
    queryClient.invalidateQueries({ queryKey: ["/api/pickups/collector"] });
  };

  const acceptPickup = async (id: number) => {
    await apiRequest("PATCH", `/api/pickups/${id}/assign`);
    queryClient.invalidateQueries({ queryKey: ["/api/pickups/collector"] });
    queryClient.invalidateQueries({ queryKey: ["/api/pickups/available"] });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Collector Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle>Available Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availablePickups?.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>
                      {new Date(pickup.scheduledDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>Location {pickup.userId}</TableCell>
                    <TableCell>{pickup.wasteType}</TableCell>
                    <TableCell>{pickup.quantity} kg</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => acceptPickup(pickup.id)}
                      >
                        Accept
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedPickups?.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>
                      {new Date(pickup.scheduledDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>Location {pickup.userId}</TableCell>
                    <TableCell>{pickup.wasteType}</TableCell>
                    <TableCell>
                      <Badge
                        variant={pickup.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {pickup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pickup.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => updatePickupStatus(pickup.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
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
