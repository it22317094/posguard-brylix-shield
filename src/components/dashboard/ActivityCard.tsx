
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "@/utils/date-utils";

interface Activity {
  id: number;
  action: string;
  user: string;
  table?: string;
  amount?: string;
  timestamp: string;
}

interface ActivityCardProps {
  activities: Activity[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activities }) => {
  const navigate = useNavigate();

  return (
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
          {activities.slice(0, 3).map((activity, index) => (
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
              {index !== activities.slice(0, 3).length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
