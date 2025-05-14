
import { useState } from 'react';

// Types
export interface Alert {
  id: number;
  title: string;
  severity: string;
  timestamp: string;
}

export interface Activity {
  id: number;
  action: string;
  user: string;
  table?: string;
  amount?: string;
  timestamp: string;
}

export interface Item {
  id: number;
  name: string;
  category: string;
}

export interface KOT {
  id: number;
  table: string;
  items: string[];
  status: string;
}

// Mock data
const mockAlerts: Alert[] = [
  { id: 1, title: "High-value bill voided", severity: "high", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 2, title: "Multiple login failures detected", severity: "high", timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString() },
  { id: 3, title: "KOT #1082 unacknowledged for 15 minutes", severity: "medium", timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 4, title: "Printer error on Station 2", severity: "low", timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString() },
];

const mockActivities: Activity[] = [
  { id: 1, action: "Bill voided", user: "John Cashier", amount: "$156.75", timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 2, action: "KOT created", user: "John Cashier", table: "Table 5", timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString() },
  { id: 3, action: "Login successful", user: "Admin User", timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString() },
  { id: 4, action: "KOT completed", user: "Kitchen Staff", table: "Table 3", timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString() },
];

const mockItems: Item[] = [
  { id: 1, name: "Chicken Burger", category: "Burgers" },
  { id: 2, name: "Cheese Pizza", category: "Pizza" },
  { id: 3, name: "French Fries", category: "Sides" },
  { id: 4, name: "Veggie Salad", category: "Salads" },
  { id: 5, name: "Cola", category: "Beverages" },
];

const mockKOTs: KOT[] = [
  { id: 1, table: "Table 5", items: ["Chicken Burger x2", "Cola x2"], status: "pending" },
  { id: 2, table: "Table 3", items: ["Cheese Pizza x1", "French Fries x1"], status: "preparing" },
];

export function useDashboardData() {
  // We're using useState here to mimic what would happen in a real app
  // where this data would be fetched from an API
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [activities] = useState<Activity[]>(mockActivities);
  const [items] = useState<Item[]>(mockItems);
  const [kots] = useState<KOT[]>(mockKOTs);

  // Calculate counts
  const unreadAlertsCount = alerts.filter(a => a.severity === "high").length;
  const pendingKOTsCount = kots.filter(k => k.status === "pending").length;
  const todayActivitiesCount = activities.length;

  return {
    alerts,
    activities,
    items,
    kots,
    counts: {
      unreadAlerts: unreadAlertsCount,
      pendingKOTs: pendingKOTsCount,
      todayActivities: todayActivitiesCount
    }
  };
}
