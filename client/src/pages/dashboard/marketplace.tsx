
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/components/ui/use-toast";

export default function MarketplaceDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: items } = useQuery({
    queryKey: ["/api/marketplace"],
  });

  const redeemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const res = await apiRequest("POST", `/api/marketplace/redeem/${itemId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace"] });
      toast({
        title: "Success",
        description: "Item redeemed successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rewards Marketplace</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Your Points:</span>
            <span className="font-semibold">{user?.rewardPoints}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                <p className="text-gray-600">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{item.pointsCost} points</span>
                  <Button
                    onClick={() => redeemMutation.mutate(item.id)}
                    disabled={
                      user?.rewardPoints < item.pointsCost ||
                      item.stockQuantity === 0 ||
                      redeemMutation.isPending
                    }
                  >
                    Redeem
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  {item.stockQuantity} left in stock
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
