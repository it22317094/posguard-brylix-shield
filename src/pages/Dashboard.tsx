
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, ListTodo, Activity } from "lucide-react";

// Custom hooks
import { useDashboardData } from "@/hooks/use-dashboard-data";

// Components
import SummaryCard from "@/components/dashboard/SummaryCard";
import QuickKOTCreator from "@/components/dashboard/QuickKOTCreator";
import AlertCard from "@/components/dashboard/AlertCard";
import ActivityCard from "@/components/dashboard/ActivityCard";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { alerts, activities, items, counts } = useDashboardData();

  // Check if user is cashier or admin
  const showAlerts = currentUser?.role === "admin" || currentUser?.role === "cashier";
  
  // Display name - show "John" if cashier, otherwise show the actual name
  const displayName = currentUser?.role === "cashier" ? "John" : currentUser?.name;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {displayName}</h1>
        <p className="text-muted-foreground">Here's what's happening with Brylix POS today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {showAlerts && (
          <SummaryCard
            title="Unread Alerts"
            count={counts.unreadAlerts}
            icon={<Bell className="h-5 w-5 text-posguard-primary" />}
            route="/alerts"
            linkText="View alerts"
          />
        )}

        <SummaryCard
          title="Pending KOTs"
          count={counts.pendingKOTs}
          icon={<ListTodo className="h-5 w-5 text-posguard-primary" />}
          route="/kot-manager"
          linkText="Manage KOTs"
        />

        {currentUser?.role === "admin" && (
          <SummaryCard
            title="Activities Today"
            count={counts.todayActivities}
            icon={<Activity className="h-5 w-5 text-posguard-primary" />}
            route="/activity-log"
            linkText="View activity"
          />
        )}
      </div>

      {/* Quick KOT Creator */}
      <QuickKOTCreator items={items} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        {showAlerts && (
          <AlertCard alerts={alerts} />
        )}

        {/* Activity Log - Only show for admin */}
        {currentUser?.role === "admin" && (
          <ActivityCard activities={activities} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
