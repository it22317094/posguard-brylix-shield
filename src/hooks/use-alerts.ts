
import { useState } from "react";
import { Alert } from "@/types/alert";

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

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  // Add a new alert
  const addAlert = (alert: Omit<Alert, "id">) => {
    const newId = Math.max(0, ...alerts.map(a => a.id)) + 1;
    setAlerts([...alerts, { ...alert, id: newId }]);
  };

  // Delete an alert
  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Update an alert
  const updateAlert = (id: number, updates: Partial<Alert>) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        return { ...alert, ...updates };
      }
      return alert;
    }));
  };

  return {
    alerts,
    setAlerts,
    addAlert,
    deleteAlert,
    updateAlert
  };
}
