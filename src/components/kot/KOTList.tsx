
import React from "react";
import KOTCard from "./KOTCard";

interface KOTItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

interface KOT {
  id: string;
  tableNumber: string;
  items: KOTItem[];
  status: "pending" | "preparing" | "ready" | "completed";
  timestamp: string;
}

interface KOTListProps {
  kots: KOT[];
  onStatusChange: (id: string, status: string) => void;
  onReopenKOT: (id: string) => void;
}

const KOTList: React.FC<KOTListProps> = ({ kots, onStatusChange, onReopenKOT }) => {
  if (kots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No KOTs found</p>
        <p className="text-gray-400 text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {kots.map((kot) => (
        <KOTCard
          key={kot.id}
          id={kot.id}
          tableNumber={kot.tableNumber}
          items={kot.items}
          status={kot.status}
          timestamp={kot.timestamp}
          onStatusChange={onStatusChange}
          onReopenKOT={onReopenKOT}
        />
      ))}
    </div>
  );
};

export default KOTList;
