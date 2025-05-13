import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Clock, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define interfaces
interface KOTItem {
  id: number;
  name: string;
  quantity: number;
}

interface KOT {
  id: number;
  tableNumber: string;
  items: KOTItem[];
  status: "pending" | "preparing" | "completed";
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockMenuItems = [
  { id: 1, name: "Chicken Burger", category: "Burgers" },
  { id: 2, name: "Cheese Pizza", category: "Pizza" },
  { id: 3, name: "French Fries", category: "Sides" },
  { id: 4, name: "Veggie Salad", category: "Salads" },
  { id: 5, name: "Cola", category: "Beverages" },
  { id: 6, name: "Fish & Chips", category: "Mains" },
  { id: 7, name: "Caesar Salad", category: "Salads" },
  { id: 8, name: "Espresso", category: "Beverages" },
  { id: 9, name: "Margherita Pizza", category: "Pizza" },
  { id: 10, name: "Chocolate Cake", category: "Desserts" },
];

const initialKOTs: KOT[] = [
  {
    id: 1,
    tableNumber: "Table 5",
    items: [
      { id: 1, name: "Chicken Burger", quantity: 2 },
      { id: 5, name: "Cola", quantity: 3 }
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 2,
    tableNumber: "Table 3",
    items: [
      { id: 2, name: "Cheese Pizza", quantity: 1 },
      { id: 3, name: "French Fries", quantity: 2 }
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 3,
    tableNumber: "Table 8",
    items: [
      { id: 6, name: "Fish & Chips", quantity: 1 },
      { id: 8, name: "Espresso", quantity: 2 }
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 4,
    tableNumber: "Table 1",
    items: [
      { id: 9, name: "Margherita Pizza", quantity: 1 },
      { id: 7, name: "Caesar Salad", quantity: 1 },
      { id: 5, name: "Cola", quantity: 2 }
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 150 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 120 * 60000).toISOString()
  }
];

const KOTManager = () => {
  const [kots, setKOTs] = useState<KOT[]>(initialKOTs);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [selectedItems, setSelectedItems] = useState<KOTItem[]>([]);
  const [currentItem, setCurrentItem] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  // Filter KOTs based on active tab
  const filteredKOTs = activeTab === "all" 
    ? kots
    : kots.filter(kot => kot.status === activeTab);

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

  // Format time difference between created and updated
  const formatTimeTaken = (created: string, updated: string) => {
    const createdDate = new Date(created);
    const updatedDate = new Date(updated);
    const diffMs = updatedDate.getTime() - createdDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "< 1 min";
    if (diffMins < 60) return `${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  };

  const handleAddItem = () => {
    if (!currentItem) return;
    
    // Find the selected menu item
    const menuItem = mockMenuItems.find(item => item.name === currentItem);
    if (!menuItem) return;
    
    // Check if item already exists in the selected items
    const existingItemIndex = selectedItems.findIndex(item => item.name === currentItem);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += currentQuantity;
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      setSelectedItems([
        ...selectedItems,
        { id: menuItem.id, name: menuItem.name, quantity: currentQuantity }
      ]);
    }
    
    setCurrentItem("");
    setCurrentQuantity(1);
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

    const now = new Date().toISOString();
    
    // Create new KOT
    const newKOT: KOT = {
      id: Math.max(0, ...kots.map(k => k.id)) + 1,
      tableNumber,
      items: selectedItems,
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    
    // Add to KOTs list
    setKOTs([newKOT, ...kots]);
    
    // Reset form
    setTableNumber("");
    setSelectedItems([]);
    setCreateDialogOpen(false);
    
    toast({
      title: "KOT Created",
      description: `KOT for ${tableNumber} has been sent to kitchen`
    });
  };

  // Handle status change
  const handleStatusChange = (kotId: number, newStatus: "pending" | "preparing" | "completed") => {
    setKOTs(kots.map(kot => {
      if (kot.id === kotId) {
        const statusText = newStatus === "preparing" 
          ? "moved to preparation"
          : newStatus === "completed"
            ? "marked as completed"
            : "moved back to pending";
            
        toast({
          title: `KOT #${kotId} ${statusText}`,
          description: `${kot.tableNumber} order status updated`
        });
        
        return {
          ...kot,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return kot;
    }));
  };

  // Get count for each status
  const pendingCount = kots.filter(k => k.status === "pending").length;
  const preparingCount = kots.filter(k => k.status === "preparing").length;
  const completedCount = kots.filter(k => k.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">KOT Manager</h1>
          <p className="text-muted-foreground">Create and manage kitchen order tickets</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
                <Label>Add Items</Label>
                <div className="flex space-x-2">
                  <Select value={currentItem} onValueChange={setCurrentItem}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMenuItems.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="w-20">
                    <Input 
                      type="number" 
                      min="1"
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  
                  <Button type="button" onClick={handleAddItem}>Add</Button>
                </div>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="border rounded-md p-3 bg-muted/50">
                  <p className="text-sm font-medium mb-2">Selected Items:</p>
                  <ul className="space-y-1">
                    {selectedItems.map((item, index) => (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <span>{item.name} × {item.quantity}</span>
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
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateKOT} className="bg-posguard-primary hover:bg-posguard-secondary">Create KOT</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">
            All
            <Badge variant="outline" className="ml-2">{kots.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="outline" className="ml-2">{pendingCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="preparing">
            Preparing
            <Badge variant="outline" className="ml-2">{preparingCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="outline" className="ml-2">{completedCount}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredKOTs.length === 0 ? (
            <div className="text-center p-8">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No KOTs found</h3>
              <p className="text-muted-foreground mt-2">
                {activeTab === "all" 
                  ? "There are no kitchen order tickets yet."
                  : `There are no ${activeTab} kitchen order tickets.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKOTs.map((kot) => (
                <Card key={kot.id} className="overflow-hidden">
                  <div className={`h-2 ${kot.status === "pending" ? "bg-yellow-400" : kot.status === "preparing" ? "bg-posguard-primary" : "bg-green-500"}`} />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{kot.tableNumber}</CardTitle>
                        <CardDescription>KOT #{kot.id}</CardDescription>
                      </div>
                      <Badge variant={
                        kot.status === "pending" ? "outline" : 
                        kot.status === "preparing" ? "secondary" : 
                        "default"
                      }>
                        {kot.status === "pending" && "Pending"}
                        {kot.status === "preparing" && "Preparing"}
                        {kot.status === "completed" && "Completed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Items:</h4>
                        <ul className="space-y-1 text-sm">
                          {kot.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.name}</span>
                              <span className="text-muted-foreground">×{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Created: {formatRelativeTime(kot.createdAt)}</span>
                        </div>
                        
                        {kot.createdAt !== kot.updatedAt && (
                          <div>
                            Time taken: {formatTimeTaken(kot.createdAt, kot.updatedAt)}
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-2 flex justify-between space-x-2">
                        {kot.status === "pending" && (
                          <Button 
                            onClick={() => handleStatusChange(kot.id, "preparing")} 
                            className="flex-1 bg-posguard-primary hover:bg-posguard-secondary"
                          >
                            Start Preparing
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                        
                        {kot.status === "preparing" && (
                          <>
                            <Button 
                              variant="outline"
                              onClick={() => handleStatusChange(kot.id, "pending")}
                              className="flex-1"
                            >
                              Move Back
                            </Button>
                            <Button 
                              onClick={() => handleStatusChange(kot.id, "completed")}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Complete
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {kot.status === "completed" && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleStatusChange(kot.id, "preparing")}
                            className="flex-1"
                          >
                            Reopen
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KOTManager;
