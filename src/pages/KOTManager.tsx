
import React from "react";
import { useKOT } from "@/hooks/use-kot";
import KOTFilter from "@/components/kot/KOTFilter";
import KOTList from "@/components/kot/KOTList";

const KOTManager = () => {
  const {
    kots,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleStatusChange,
    handleReopenKOT
  } = useKOT();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kitchen Order Tickets</h1>
        <p className="text-muted-foreground">Manage and track kitchen orders</p>
      </div>

      {/* Filter Controls */}
      <KOTFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* KOT List */}
      {isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-posguard-primary"></div>
        </div>
      ) : (
        <KOTList
          kots={kots}
          onStatusChange={handleStatusChange}
          onReopenKOT={handleReopenKOT}
        />
      )}
    </div>
  );
};

export default KOTManager;
