
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface KOTFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const KOTFilter: React.FC<KOTFilterProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search by table number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex space-x-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => onStatusFilterChange("all")}
          className={statusFilter === "all" ? "bg-posguard-primary hover:bg-posguard-secondary" : ""}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          onClick={() => onStatusFilterChange("pending")}
          className={statusFilter === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "preparing" ? "default" : "outline"}
          onClick={() => onStatusFilterChange("preparing")}
          className={statusFilter === "preparing" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          Preparing
        </Button>
        <Button
          variant={statusFilter === "ready" ? "default" : "outline"}
          onClick={() => onStatusFilterChange("ready")}
          className={statusFilter === "ready" ? "bg-green-500 hover:bg-green-600" : ""}
        >
          Ready
        </Button>
      </div>
    </div>
  );
};

export default KOTFilter;
