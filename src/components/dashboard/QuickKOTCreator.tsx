
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Item {
  id: number;
  name: string;
  category: string;
}

interface QuickKOTCreatorProps {
  items: Item[];
}

const QuickKOTCreator: React.FC<QuickKOTCreatorProps> = ({ items }) => {
  const [quickKOTOpen, setQuickKOTOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState("");
  const navigate = useNavigate();

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

    // Create new KOT object
    const newKOT = {
      id: `kot${Date.now()}`, // Generate a unique ID
      tableNumber,
      items: selectedItems.map((name, index) => ({
        id: `item${Date.now()}-${index}`,
        name,
        quantity: 1,
      })),
      status: "pending",
      timestamp: new Date().toISOString()
    };

    // Add to localStorage
    try {
      const storedKOTs = localStorage.getItem('posguard_kots');
      const kots = storedKOTs ? JSON.parse(storedKOTs) : [];
      kots.unshift(newKOT); // Add to beginning of array
      localStorage.setItem('posguard_kots', JSON.stringify(kots));
      
      toast({
        title: "KOT Created",
        description: `KOT for Table ${tableNumber} has been sent to kitchen`
      });
      
      setQuickKOTOpen(false);
      setTableNumber("");
      setSelectedItems([]);
      
      // Optionally navigate to KOT Manager
      navigate('/kot-manager');
    } catch (error) {
      console.error('Failed to save KOT', error);
      toast({
        title: "Error",
        description: "Failed to create KOT. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
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
                      {items.map((item) => (
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
  );
};

export default QuickKOTCreator;
