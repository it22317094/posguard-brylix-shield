
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell, CheckCircle, Clock, Eye, Filter, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Define types
type AlertSeverity = "high" | "medium" | "low";

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
  category: string;
  details?: string;
}

// Mock alerts data
const initialAlerts: Alert[] = [
  {
    id: 1,
    title: "High-value bill voided",
    description: "Bill #3845 for $156.75 was voided by John Cashier without manager approval.",
    severity: "high",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    acknowledged: false,
    category: "billing",
    details: "This transaction was voided at 3:45 PM by user John Cashier (Station: POS-01). The bill contained 8 items totaling $156.75. This exceeds the $100 threshold for cashier-level void permissions. No manager override code was used."
  },
  {
    id: 2,
    title: "Multiple login failures detected",
    description: "5 failed login attempts from IP 192.168.1.45 within 10 minutes.",
    severity: "high",
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    acknowledged: false,
    category: "security",
    details: "Login attempts occurred between 10:15 AM and 10:25 AM from IP address 192.168.1.45. The attempts were made against user accounts: manager@brylix.com, admin@brylix.com, and support@brylix.com. The IP has been temporarily blocked for 30 minutes."
  },
  {
    id: 3,
    title: "KOT #1082 unacknowledged for 15 minutes",
    description: "Table 7 order has not been picked up by kitchen staff.",
    severity: "medium",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    acknowledged: false,
    category: "operations",
    details: "KOT #1082 for Table 7 was created at 7:30 PM by Sarah Cashier. The order contains 4 items (2 appetizers, 2 main courses). Kitchen staff has not acknowledged receipt of this order. Average acknowledgement time is 2-3 minutes."
  },
  {
    id: 4,
    title: "Printer error on Station 2",
    description: "Thermal printer on cashier station 2 reporting paper jam.",
    severity: "low",
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    acknowledged: false,
    category: "hardware",
    details: "Epson TM-T88VI printer on Station 2 reported error code E-01 (paper jam) at 1:45 PM. The printer has been offline for 2 hours. Last maintenance was performed 45 days ago. Station 2 is currently routing print jobs to Station 1."
  },
  {
    id: 5,
    title: "Unauthorized menu change attempted",
    description: "User 'john.cashier' attempted to modify menu prices without permission.",
    severity: "high",
    timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    acknowledged: true,
    category: "security",
    details: "At 11:23 AM, user john.cashier attempted to modify the price of 'Grilled Salmon' from $24.99 to $19.99. This action requires manager-level permissions. The attempt was blocked and logged. This is the second such attempt from this user in the past 7 days."
  },
  {
    id: 6,
    title: "Excessive drawer opens detected",
    description: "Cash drawer on Station 1 opened 12 times in one hour.",
    severity: "medium",
    timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    acknowledged: false,
    category: "operations",
    details: "Between 12:00 PM and 1:00 PM, the cash drawer on Station 1 was opened 12 times by user mary.cashier. Normal frequency is 4-6 times per hour. Only 5 cash transactions were processed during this period. 7 drawer opens were not associated with transactions."
  },
  {
    id: 7,
    title: "Multiple discounts applied",
    description: "Bill #3952 received 3 different discount types. Possible discount abuse.",
    severity: "medium",
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    acknowledged: true,
    category: "billing",
    details: "Bill #3952 for Table 12 ($78.50 subtotal) received multiple discount applications: 10% Senior discount, 15% Happy Hour discount, and 5% Loyalty Program discount. Total discount amount: $23.55 (30%). This exceeds the maximum allowed combined discount of 20%. Cashier: john.cashier"
  },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "billing", "security", "operations", "hardware"
  ]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Get all available categories
  const allCategories = Array.from(new Set(alerts.map(a => a.category)));

  // Filter alerts based on active tab and selected categories
  const filteredAlerts = alerts.filter(alert => {
    // Filter by tab
    if (activeTab === "all" || 
        (activeTab === "acknowledged" && alert.acknowledged) ||
        (activeTab === "unacknowledged" && !alert.acknowledged) ||
        (activeTab === "high" && alert.severity === "high") ||
        (activeTab === "medium" && alert.severity === "medium") ||
        (activeTab === "low" && alert.severity === "low")) {
      // Filter by selected categories
      return selectedCategories.includes(alert.category);
    }
    return false;
  });

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

  // Handle acknowledging alerts
  const handleAcknowledge = (id: number) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        toast({
          title: "Alert acknowledged",
          description: `Alert #${id} has been marked as acknowledged.`
        });
        
        return { ...alert, acknowledged: true };
      }
      return alert;
    }));
  };

  // Handle viewing alert details
  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailsOpen(true);
  };

  // Handle bulk acknowledge
  const handleBulkAcknowledge = () => {
    const unacknowledged = filteredAlerts.filter(alert => !alert.acknowledged);
    
    if (unacknowledged.length === 0) {
      toast({
        title: "No alerts to acknowledge",
        description: "All displayed alerts are already acknowledged."
      });
      return;
    }
    
    setAlerts(alerts.map(alert => {
      if (!alert.acknowledged && filteredAlerts.some(a => a.id === alert.id)) {
        return { ...alert, acknowledged: true };
      }
      return alert;
    }));
    
    toast({
      title: "Alerts acknowledged",
      description: `${unacknowledged.length} alerts have been acknowledged.`
    });
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(c => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  // Get counts
  const allCount = alerts.length;
  const acknowledgedCount = alerts.filter(a => a.acknowledged).length;
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  const highCount = alerts.filter(a => a.severity === "high").length;
  const mediumCount = alerts.filter(a => a.severity === "medium").length;
  const lowCount = alerts.filter(a => a.severity === "low").length;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Alerts</h1>
            <p className="text-muted-foreground">Monitor and respond to system alerts</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {allCategories.map((category) => (
                    <DropdownMenuItem key={category} onSelect={(e) => e.preventDefault()}>
                      <div className="flex items-center space-x-2 w-full">
                        <Checkbox 
                          id={`category-${category}`} 
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label 
                          htmlFor={`category-${category}`} 
                          className="flex-1 cursor-pointer capitalize"
                        >
                          {category}
                        </label>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={handleBulkAcknowledge}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Acknowledge All
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 gap-2">
            <TabsTrigger value="all">
              All
              <Badge variant="outline" className="ml-2">{allCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unacknowledged">
              Unack.
              <Badge variant="outline" className="ml-2">{unacknowledgedCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="acknowledged">
              Ack.
              <Badge variant="outline" className="ml-2">{acknowledgedCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="high" className="text-red-600">
              High
              <Badge variant="outline" className="ml-2">{highCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-yellow-600">
              Medium
              <Badge variant="outline" className="ml-2">{mediumCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="low" className="text-green-600">
              Low
              <Badge variant="outline" className="ml-2">{lowCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center p-8">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No alerts found</h3>
                <p className="text-muted-foreground mt-2">
                  There are no alerts matching your current filters.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`overflow-hidden ${
                  alert.severity === "high" ? "alert-high" : 
                  alert.severity === "medium" ? "alert-medium" : 
                  "alert-low"
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {alert.title}
                          {alert.acknowledged && (
                            <Badge variant="outline" className="text-green-600">
                              Acknowledged
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-3">
                          <span className="capitalize">{alert.category}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatRelativeTime(alert.timestamp)}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={
                        alert.severity === "high" ? "destructive" : 
                        alert.severity === "medium" ? "default" : 
                        "outline"
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{alert.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    {!alert.acknowledged && (
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Acknowledged
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      className="ml-auto" 
                      onClick={() => handleViewDetails(alert)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Alert Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert?.title}
              <Badge variant={
                selectedAlert?.severity === "high" ? "destructive" : 
                selectedAlert?.severity === "medium" ? "default" : 
                "outline"
              }>
                {selectedAlert?.severity}
              </Badge>
            </DialogTitle>
            <DialogDescription className="flex items-center space-x-3 mt-1">
              <span className="capitalize">{selectedAlert?.category}</span>
              <span>•</span>
              <span>
                {selectedAlert && new Date(selectedAlert.timestamp).toLocaleString()}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-2">
            <div>
              <h4 className="text-sm font-medium mb-1">Alert Description</h4>
              <p className="text-sm">{selectedAlert?.description}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-1">Detailed Information</h4>
              <p className="text-sm whitespace-pre-line">{selectedAlert?.details}</p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            {selectedAlert && !selectedAlert.acknowledged && (
              <Button 
                variant="outline" 
                onClick={() => {
                  handleAcknowledge(selectedAlert.id);
                  setIsDetailsOpen(false);
                }}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Acknowledge
              </Button>
            )}
            <Button onClick={() => setIsDetailsOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Alerts;
