import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: households } = useQuery({
    queryKey: ["/api/users/household"],
  });

  const { data: collectors } = useQuery({
    queryKey: ["/api/users/collector"],
  });

  const { data: recyclingCenters } = useQuery({
    queryKey: ["/api/users/recycling"],
  });

  const { data: requirements } = useQuery({
    queryKey: ["/api/requirements"],
  });

  const userStats = [
    { name: "Households", value: households?.length || 0 },
    { name: "Collectors", value: collectors?.length || 0 },
    { name: "Recycling Centers", value: recyclingCenters?.length || 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.values(UserRole).map((role) => (
            <Card key={role}>
              <CardHeader>
                <CardTitle className="capitalize">{role}s</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {role === "household"
                    ? households?.length
                    : role === "collector"
                    ? collectors?.length
                    : role === "recycling"
                    ? recyclingCenters?.length
                    : 0}
                </div>
                <p className="text-sm text-gray-600">Registered Users</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Latest Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Center ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements?.slice(0, 5).map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.recyclingCenterId}</TableCell>
                      <TableCell>{req.wasteType}</TableCell>
                      <TableCell>{req.quantity}kg</TableCell>
                      <TableCell>₹{req.price}/kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Reward Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...(households || []), ...(collectors || []), ...(recyclingCenters || [])]
                  .sort((a, b) => a.id - b.id)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.rewardPoints}</TableCell>
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
