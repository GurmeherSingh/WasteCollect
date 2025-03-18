
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

import { SiPuma, SiStarbucks, SiAmazon, SiTarget, SiNike, SiAdidas, SiMcdonalds } from 'react-icons/si';
import { GiHerbsBundle } from 'react-icons/gi';

const BRANDS = [
  { id: 1, name: "Nike", Icon: SiNike },
  { id: 2, name: "Adidas", Icon: SiAdidas },
  { id: 3, name: "Puma", Icon: SiPuma },
  { id: 4, name: "iHerb", Icon: GiHerbsBundle },
  { id: 5, name: "McDonald's", Icon: SiMcdonalds },
  { id: 6, name: "Starbucks", Icon: SiStarbucks },
  { id: 7, name: "Amazon", Icon: SiAmazon },
  { id: 8, name: "Target", Icon: SiTarget }
];

export default function MarketplaceDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

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
        description: "Coupon redeemed successfully!",
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

  const filteredBrands = BRANDS.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-emerald-50/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Rewards Marketplace</h1>
              <p className="text-green-600 mt-2">Redeem your points for exclusive deals</p>
            </div>
            <div className="flex items-center gap-4 bg-white/80 p-3 rounded-lg shadow-sm">
              <span className="text-sm text-green-700">Available Points:</span>
              <span className="text-2xl font-bold text-green-800">{user?.rewardPoints}</span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            <Input
              type="text"
              placeholder="Search brands..."
              className="pl-10 bg-white/80 border-green-200 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => (
              <Card key={brand.id} className="bg-white/80 border-green-100 hover:shadow-lg transition-all">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <brand.Icon className="w-8 h-8 text-gray-800" />
                    <span className="text-sm text-green-600 font-medium">Featured</span>
                  </div>
                  <CardTitle className="text-xl text-green-800">{brand.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-700">20% OFF</span>
                      <Button 
                        onClick={() => redeemMutation.mutate(brand.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Redeem
                      </Button>
                    </div>
                    <div className="text-sm text-green-600">Valid until Dec 31, 2024</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
