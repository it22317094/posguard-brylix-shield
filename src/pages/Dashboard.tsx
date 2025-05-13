
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ListTodo, Activity, Clock, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockAlerts = [
  { id: 1, title: "High-value bill voided", severity: "high", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 2, title: "Multiple login failures detected", severity: "high", timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString() },
  { id: 3, title: "KOT #1082 unacknowledged for 15 minutes", severity: "medium", timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 4, title: "Printer error on Station 2", severity: "low", timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString() },
];

const mockActivities = [
  { id: 1, action: "Bill voided", user: "John Cashier", amount: "$156.75", timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 2, action: "KOT created", user: "John Cashier", table: "Table 5", timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString() },
  { id: 3, action: "Login successful", user: "Admin User", timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString() },
  { id: 4, action: "KOT completed", user: "Kitchen Staff", table: "Table 3", timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString() },
];

const mockItems = [
  { id: 1, name: "Chicken Burger", category: "Burgers" },
  { id: 2, name: "Cheese Pizza", category: "Pizza" },
  { id: 3, name: "French Fries", category: "Sides" },
  { id: 4, name: "Veggie Salad", category: "Salads" },
  { id: 5, name: "Cola", category: "Beverages" },
];

const mockKOTs = [
  { id: 1, table: "Table 5", items: ["Chicken Burger x2", "Cola x2"], status: "pending" },
  { id: 2, table: "Table 3", items: ["Cheese Pizza x1", "French Fries x1"], status: "preparing" },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quickKOTOpen, setQuickKOTOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState("");

  // Calculate counts
  const unreadAlertsCount = mockAlerts.filter(a => a.severity === "high").length;
  const pendingKOTsCount = mockKOTs.filter(k => k.status === "pending").length;
  const todayActivitiesCount = mockActivities.length;

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleAddItem = () => {
    if (currentItem) {
      setSelectedItems([...selectedItems, currentItem]);
      setCurrentItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleCreateKOT = () => {
    if (!tableNumber || selectedItems.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a table number and select at least one item",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would call an API to create a KOT
    toast({
      title: "KOT Created",
      description: `KOT for ${tableNumber} has been sent to kitchen`
    });
    
    setQuickKOTOpen(false);
    setTableNumber("");
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {currentUser?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with Brylix POS today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unread Alerts</CardTitle>
              <CardDescription className="text-2xl font-bold">{unreadAlertsCount}</CardDescription>
            </div>
            <Bell className="h-5 w-5 text-posguard-primary" />
          </CardHeader>
          <CardContent>
            <Button variant="link" size="sm" className="p-0 h-auto text-posguard-primary" onClick={() => navigate("/alerts")}>
              View alerts <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending KOTs</CardTitle>
              <CardDescription className="text-2xl font-bold">{pendingKOTsCount}</CardDescription>
            </div>
            <ListTodo className="h-5 w-5 text-posguard-primary" />
          </CardHeader>
          <CardContent>
            <Button variant="link" size="sm" className="p-0 h-auto text-posguard-primary" onClick={() => navigate("/kot-manager")}>
              Manage KOTs <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activities Today</CardTitle>
              <CardDescription className="text-2xl font-bold">{todayActivitiesCount}</CardDescription>
            </div>
            <Activity className="h-5 w-5 text-posguard-primary" />
          </CardHeader>
          <CardContent>
            <Button variant="link" size="sm" className="p-0 h-auto text-posguard-primary" onClick={() => navigate("/activity-log")}>
              View activity <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick KOT Creator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick KOT Creator</CardTitle>
          <CardDescription>Quickly create and send kitchen order tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={quickKOTOpen} onOpenChange={setQuickKOTOpen}>
            <DialogTrigger asChild>
              <Button className="bg-posguard-primary hover:bg-posguard-secondary">
                <Plus className="mr-2 h-4 w-4" />
                Create New KOT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New KOT</DialogTitle>
                <DialogDescription>
                  Create a new kitchen order ticket to send to the kitchen staff
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="table">Table Number</Label>
                  <Input 
                    id="table" 
                    value={tableNumber} 
                    onChange={(e) => setTableNumber(e.target.value)} 
                    placeholder="e.g. Table 5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item">Add Items</Label>
                  <div className="flex space-x-2">
                    <Select value={currentItem} onValueChange={setCurrentItem}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockItems.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddItem}>Add</Button>
                  </div>
                </div>
                
                {selectedItems.length > 0 && (
                  <div className="border rounded-md p-3 bg-muted/50">
                    <p className="text-sm font-medium mb-2">Selected Items:</p>
                    <ul className="space-y-1">
                      {selectedItems.map((item, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span>{item}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveItem(index)}
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            &times;
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setQuickKOTOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateKOT} className="bg-posguard-primary hover:bg-posguard-secondary">Create KOT</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => navigate("/alerts")}
                className="text-posguard-primary"
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-md bg-white shadow-sm ${alert.severity === "high" ? "alert-high" : alert.severity === "medium" ? "alert-medium" : "alert-low"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(alert.timestamp)}</span>
                      </div>
                    </div>
                    <Badge variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "outline"}>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => navigate("/activity-log")}
                className="text-posguard-primary"
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{activity.action}</h4>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by {activity.user}
                    {activity.table && ` • ${activity.table}`}
                    {activity.amount && ` • ${activity.amount}`}
                  </p>
                  {activity.id !== mockActivities.slice(0, 3).length && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
