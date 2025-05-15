
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
    handleReopenKOT,
    refreshKOTs
  } = useKOT();

  // Auto refresh KOTs every 30 seconds
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      refreshKOTs();
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [refreshKOTs]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kitchen Order Tickets</h1>
          <p className="text-muted-foreground">Manage and track kitchen orders</p>
        </div>
        <button 
          onClick={refreshKOTs}
          className="bg-posguard-primary hover:bg-posguard-secondary text-white px-3 py-2 rounded-md text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 12a9 9 0 0 0 6.7 15L13 21"></path>
            <path d="M13 21h6v-6"></path>
          </svg>
          Refresh
        </button>
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
