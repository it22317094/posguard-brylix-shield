
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "@/utils/date-utils";

interface Alert {
  id: number;
  title: string;
  severity: string;
  timestamp: string;
}

interface AlertCardProps {
  alerts: Alert[];
}

const AlertCard: React.FC<AlertCardProps> = ({ alerts }) => {
  const navigate = useNavigate();

  return (
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
          {alerts.slice(0, 3).map((alert) => (
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
  );
};

export default AlertCard;
