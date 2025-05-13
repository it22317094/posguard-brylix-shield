
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Alert } from "@/types/alert";
import { AlertDetailsDialog } from "@/components/alerts/AlertDetailsDialog";
import { AlertsFilterBar } from "@/components/alerts/AlertsFilterBar";
import { AlertsTabList } from "@/components/alerts/AlertsTabList";
import { useAlerts } from "@/hooks/use-alerts";

const Alerts = () => {
  const { alerts, setAlerts } = useAlerts();
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
