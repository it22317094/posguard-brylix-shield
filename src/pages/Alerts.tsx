import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Alert } from "@/types/alert";
import { AlertDetailsDialog } from "@/components/alerts/AlertDetailsDialog";
import { AlertsFilterBar } from "@/components/alerts/AlertsFilterBar";
import { AlertsTabList } from "@/components/alerts/AlertsTabList";

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
  const alertCounts = {
    all: alerts.length,
    acknowledged: alerts.filter(a => a.acknowledged).length,
    unacknowledged: alerts.filter(a => !a.acknowledged).length,
    high: alerts.filter(a => a.severity === "high").length,
    medium: alerts.filter(a => a.severity === "medium").length,
    low: alerts.filter(a => a.severity === "low").length
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Alerts</h1>
            <p className="text-muted-foreground">Monitor and respond to system alerts</p>
          </div>
          
          <AlertsFilterBar 
            categories={allCategories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            handleBulkAcknowledge={handleBulkAcknowledge}
          />
        </div>

        <AlertsTabList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredAlerts={filteredAlerts}
          alertCounts={alertCounts}
          handleAcknowledge={handleAcknowledge}
          handleViewDetails={handleViewDetails}
        />
      </div>

      <AlertDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        alert={selectedAlert}
        onAcknowledge={handleAcknowledge}
      />
    </>
  );
};

export default Alerts;
