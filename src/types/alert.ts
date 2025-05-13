
export type AlertSeverity = "high" | "medium" | "low";

export interface Alert {
  id: number;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
  category: string;
  details?: string;
}
