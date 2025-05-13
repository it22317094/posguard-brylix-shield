
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Eye } from "lucide-react";
import { Alert } from "@/types/alert";
import { formatRelativeTime } from "@/utils/date-utils";

interface AlertItemProps {
  alert: Alert;
  onAcknowledge: (id: number) => void;
  onViewDetails: (alert: Alert) => void;
}

export const AlertItem: React.FC<AlertItemProps> = ({
  alert,
  onAcknowledge,
  onViewDetails
}) => {
  return (
    <Card className={`overflow-hidden ${
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
            onClick={() => onAcknowledge(alert.id)}
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Acknowledged
          </Button>
        )}
        <Button 
          variant="ghost" 
          className="ml-auto" 
          onClick={() => onViewDetails(alert)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
