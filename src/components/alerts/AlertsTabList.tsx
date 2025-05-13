
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert } from "@/types/alert";
import { AlertItem } from "./AlertItem";

interface AlertCounts {
  all: number;
  acknowledged: number;
  unacknowledged: number;
  high: number;
  medium: number;
  low: number;
}

interface AlertsTabListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredAlerts: Alert[];
  alertCounts: AlertCounts;
  handleAcknowledge: (id: number) => void;
  handleViewDetails: (alert: Alert) => void;
}

export const AlertsTabList: React.FC<AlertsTabListProps> = ({
  activeTab,
  setActiveTab,
  filteredAlerts,
  alertCounts,
  handleAcknowledge,
  handleViewDetails
}) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-6 gap-2">
        <TabsTrigger value="all">
          All
          <Badge variant="outline" className="ml-2">{alertCounts.all}</Badge>
        </TabsTrigger>
        <TabsTrigger value="unacknowledged">
          Unack.
          <Badge variant="outline" className="ml-2">{alertCounts.unacknowledged}</Badge>
        </TabsTrigger>
        <TabsTrigger value="acknowledged">
          Ack.
          <Badge variant="outline" className="ml-2">{alertCounts.acknowledged}</Badge>
        </TabsTrigger>
        <TabsTrigger value="high" className="text-red-600">
          High
          <Badge variant="outline" className="ml-2">{alertCounts.high}</Badge>
        </TabsTrigger>
        <TabsTrigger value="medium" className="text-yellow-600">
          Medium
          <Badge variant="outline" className="ml-2">{alertCounts.medium}</Badge>
        </TabsTrigger>
        <TabsTrigger value="low" className="text-green-600">
          Low
          <Badge variant="outline" className="ml-2">{alertCounts.low}</Badge>
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
            <AlertItem 
              key={alert.id} 
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};
