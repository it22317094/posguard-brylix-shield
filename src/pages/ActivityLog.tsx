
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Search, User } from "lucide-react";
import { format } from "date-fns";

// Define types
interface Activity {
  id: number;
  timestamp: string;
  action: string;
  user: {
    name: string;
    role: string;
  };
  details: string;
  type: string;
}

// Mock activity data
const initialActivities: Activity[] = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    action: "Bill voided",
    user: { name: "John Cashier", role: "cashier" },
    details: "Bill #3845 for $156.75 was voided. Reason: 'Customer changed order'",
    type: "billing"
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    action: "KOT created",
    user: { name: "John Cashier", role: "cashier" },
    details: "KOT #1082 for Table 5 with 4 items was created",
    type: "kot"
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    action: "Login successful",
    user: { name: "Admin User", role: "admin" },
    details: "Admin user logged in from IP 192.168.1.10",
    type: "security"
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    action: "KOT completed",
    user: { name: "Kitchen Staff", role: "kitchen" },
    details: "KOT #1080 for Table 3 was marked as completed",
    type: "kot"
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 12 * 60 * 60000).toISOString(),
    action: "Menu item created",
    user: { name: "Admin User", role: "admin" },
    details: "New menu item 'Veggie Supreme Pizza' was added to 'Pizza' category",
    type: "system"
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    action: "Discount applied",
    user: { name: "John Cashier", role: "cashier" },
    details: "15% discount applied to Bill #3850. Reason: 'Manager approval for loyal customer'",
    type: "billing"
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 8 * 60 * 60000).toISOString(),
    action: "Login failed",
    user: { name: "Unknown", role: "unknown" },
    details: "Failed login attempt for user 'john.cashier' from IP 203.0.113.45",
    type: "security"
  },
  {
    id: 8,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    action: "Cash drawer opened",
    user: { name: "John Cashier", role: "cashier" },
    details: "Cash drawer opened on Station 1. Reason: 'Give change'",
    type: "billing"
  },
  {
    id: 9,
    timestamp: new Date(Date.now() - 7 * 60 * 60000).toISOString(),
    action: "Unauthorized access attempt",
    user: { name: "John Cashier", role: "cashier" },
    details: "User attempted to access admin settings without proper permissions",
    type: "security"
  },
  {
    id: 10,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    action: "Shift started",
    user: { name: "John Cashier", role: "cashier" },
    details: "User started shift on Station 2",
    type: "system"
  }
];

const ActivityLog = () => {
  const [activities] = useState<Activity[]>(initialActivities);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  // Get unique users for filter
  const users = Array.from(new Set(activities.map(a => a.user.name)));
  
  // Filter activities based on active tab, search, and user filter
  const filteredActivities = activities.filter(activity => {
    // Filter by tab (activity type)
    const typeMatch = activeTab === "all" || activity.type === activeTab;
    
    // Filter by user
    const userMatch = userFilter === "all" || activity.user.name === userFilter;
    
    // Filter by search text
    const searchMatch = search === "" || 
      activity.action.toLowerCase().includes(search.toLowerCase()) || 
      activity.details.toLowerCase().includes(search.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(search.toLowerCase());
    
    return typeMatch && userMatch && searchMatch;
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

  // Format exact time
  const formatExactTime = (timestamp: string) => {
    return format(new Date(timestamp), "MMM d, yyyy h:mm a");
  };

  // Count activities by type
  const activityCounts = {
    all: activities.length,
    billing: activities.filter(a => a.type === "billing").length,
    kot: activities.filter(a => a.type === "kot").length,
    security: activities.filter(a => a.type === "security").length,
    system: activities.filter(a => a.type === "system").length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <p className="text-muted-foreground">View all system and user activities</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map(user => (
                <SelectItem key={user} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">
            All
            <Badge variant="outline" className="ml-2">{activityCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="billing">
            Billing
            <Badge variant="outline" className="ml-2">{activityCounts.billing}</Badge>
          </TabsTrigger>
          <TabsTrigger value="kot">
            KOT
            <Badge variant="outline" className="ml-2">{activityCounts.kot}</Badge>
          </TabsTrigger>
          <TabsTrigger value="security">
            Security
            <Badge variant="outline" className="ml-2">{activityCounts.security}</Badge>
          </TabsTrigger>
          <TabsTrigger value="system">
            System
            <Badge variant="outline" className="ml-2">{activityCounts.system}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>
                {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredActivities.length === 0 ? (
                <div className="text-center p-8">
                  <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No activities found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredActivities.map((activity, index) => {
                    // Group activities by date
                    const currentDate = new Date(activity.timestamp).toDateString();
                    const prevDate = index > 0 
                      ? new Date(filteredActivities[index - 1].timestamp).toDateString() 
                      : null;
                    
                    const showDateHeader = index === 0 || currentDate !== prevDate;
                    
                    return (
                      <React.Fragment key={activity.id}>
                        {showDateHeader && (
                          <div className="sticky top-0 bg-white py-2 z-10">
                            <h3 className="text-sm font-medium text-muted-foreground">
                              {currentDate === new Date().toDateString() 
                                ? "Today" 
                                : format(new Date(activity.timestamp), "MMMM d, yyyy")}
                            </h3>
                          </div>
                        )}
                        
                        <div className="relative pl-8 pb-8">
                          {/* Timeline connector */}
                          {index < filteredActivities.length - 1 && (
                            <div className="absolute left-3 top-3 bottom-0 w-px bg-border" />
                          )}
                          
                          {/* Timeline dot */}
                          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            activity.type === "security" ? "bg-red-100" : 
                            activity.type === "billing" ? "bg-blue-100" :
                            activity.type === "kot" ? "bg-green-100" : "bg-gray-100"
                          }`}>
                            <div className={`w-3 h-3 rounded-full ${
                              activity.type === "security" ? "bg-red-500" : 
                              activity.type === "billing" ? "bg-blue-500" :
                              activity.type === "kot" ? "bg-green-500" : "bg-gray-500"
                            }`} />
                          </div>
                          
                          {/* Activity content */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{activity.action}</h4>
                              <div className="flex items-center text-xs text-muted-foreground" title={formatExactTime(activity.timestamp)}>
                                <Clock className="inline h-3 w-3 mr-1" />
                                {formatRelativeTime(activity.timestamp)}
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">{activity.details}</p>
                            
                            <div className="flex items-center gap-1 text-xs">
                              <div className="bg-muted px-2 py-1 rounded-full flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>{activity.user.name}</span>
                              </div>
                              
                              <Badge variant="outline" className="capitalize">
                                {activity.user.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityLog;
