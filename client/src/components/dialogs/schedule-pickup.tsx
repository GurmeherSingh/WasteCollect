
import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function SchedulePickupDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wasteType, setWasteType] = useState("");
  const [customWasteType, setCustomWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiRequest("POST", "/api/pickups", {
        wasteType: wasteType === 'custom' ? customWasteType : wasteType,
        quantity: parseInt(quantity),
        scheduledDate: date,
        status: "scheduled"
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/pickups/user"] });
      setOpen(false);
    } catch (error) {
      console.error("Failed to schedule pickup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Schedule New Pickup</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a Pickup</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {wasteType === 'custom' ? (
            <Input
              placeholder="Enter custom waste type"
              value={customWasteType}
              onChange={(e) => setCustomWasteType(e.target.value)}
              required
            />
          ) : (
            <Select value={wasteType} onValueChange={setWasteType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select waste type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plastic">Plastic</SelectItem>
                <SelectItem value="paper">Paper</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="mix">MIX</SelectItem>
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Input
            type="number"
            placeholder="Quantity (kg)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? "Scheduling..." : "Schedule Pickup"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
