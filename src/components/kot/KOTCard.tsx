
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface KOTItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

interface KOTCardProps {
  id: string;
  tableNumber: string;
  items: KOTItem[];
  status: "pending" | "preparing" | "ready" | "completed";
  timestamp: string;
  onStatusChange: (id: string, status: string) => void;
  onReopenKOT?: (id: string) => void;
}

const KOTCard: React.FC<KOTCardProps> = ({
  id,
  tableNumber,
  items,
  status,
  timestamp,
  onStatusChange,
  onReopenKOT,
}) => {
  const { currentUser } = useAuth();
  const isKitchenStaff = currentUser?.role === "kitchen";
  
  // Status color mapping
  const statusColorMap = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };
  
  // Format the timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Table {tableNumber}</h3>
          <p className="text-xs text-muted-foreground">
            {formatTime(timestamp)}
          </p>
        </div>
        <Badge className={statusColorMap[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm flex justify-between">
              <span>{item.name}</span>
              <span className="font-medium">x{item.quantity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-wrap gap-2">
        {status === "pending" && (
          <Button 
            size="sm" 
            onClick={() => onStatusChange(id, "preparing")}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Start Preparing
          </Button>
        )}
        
        {status === "preparing" && (
          <Button 
            size="sm" 
            onClick={() => onStatusChange(id, "ready")}
            className="bg-green-500 hover:bg-green-600"
          >
            Mark Ready
          </Button>
        )}
        
        {status === "ready" && (
          <Button 
            size="sm" 
            onClick={() => onStatusChange(id, "completed")}
          >
            Complete
          </Button>
        )}
        
        {status === "completed" && !isKitchenStaff && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onReopenKOT && onReopenKOT(id)}
          >
            Reopen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default KOTCard;
