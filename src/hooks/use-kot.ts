
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface KOTItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface KOT {
  id: string;
  tableNumber: string;
  items: KOTItem[];
  status: "pending" | "preparing" | "ready" | "completed";
  timestamp: string;
}

// Mock data for demonstration purposes
const mockKOTs: KOT[] = [
  {
    id: "kot1",
    tableNumber: "12",
    items: [
      { id: "i1", name: "Chicken Pasta", quantity: 2 },
      { id: "i2", name: "Garlic Bread", quantity: 1 },
      { id: "i3", name: "Cola", quantity: 2 }
    ],
    status: "pending",
    timestamp: new Date().toISOString()
  },
  {
    id: "kot2",
    tableNumber: "5",
    items: [
      { id: "i4", name: "Margherita Pizza", quantity: 1 },
      { id: "i5", name: "Garden Salad", quantity: 1 }
    ],
    status: "preparing",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString() // 15 minutes ago
  },
  {
    id: "kot3",
    tableNumber: "8",
    items: [
      { id: "i6", name: "Beef Burger", quantity: 2 },
      { id: "i7", name: "French Fries", quantity: 2 },
      { id: "i8", name: "Chocolate Shake", quantity: 2 }
    ],
    status: "ready",
    timestamp: new Date(Date.now() - 25 * 60000).toISOString() // 25 minutes ago
  }
];

// Use localStorage to persist KOTs between sessions and simulate real database
const getStoredKOTs = (): KOT[] => {
  const storedKOTs = localStorage.getItem('posguard_kots');
  if (storedKOTs) {
    try {
      return JSON.parse(storedKOTs);
    } catch (error) {
      console.error('Failed to parse KOTs from localStorage', error);
      return mockKOTs;
    }
  }
  // Initialize with mock data on first load
  localStorage.setItem('posguard_kots', JSON.stringify(mockKOTs));
  return mockKOTs;
};

export const useKOT = () => {
  const [kots, setKots] = useState<KOT[]>(getStoredKOTs());
  const [filteredKots, setFilteredKots] = useState<KOT[]>(kots);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Save KOTs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('posguard_kots', JSON.stringify(kots));
  }, [kots]);

  // Function to refresh KOTs (simulating a fetch from server)
  const refreshKOTs = useCallback(() => {
    setIsLoading(true);
    
    // Simulate network request delay
    setTimeout(() => {
      const storedKOTs = getStoredKOTs();
      setKots(storedKOTs);
      setIsLoading(false);
      
      // Show toast notification
      toast({
        title: "KOTs Updated",
        description: "Kitchen order tickets have been refreshed",
      });
    }, 600);
  }, [toast]);

  // Function to handle KOT status changes
  const handleStatusChange = (kotId: string, newStatus: string) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const updatedKots = kots.map(kot => 
        kot.id === kotId 
          ? { ...kot, status: newStatus as "pending" | "preparing" | "ready" | "completed" } 
          : kot
      );
      
      setKots(updatedKots);
      
      // Show toast notification
      toast({
        title: "Status Updated",
        description: `KOT #${kotId} has been updated to ${newStatus}`,
      });
      
      setIsLoading(false);
    }, 300);
  };

  // Function to reopen a completed KOT
  const handleReopenKOT = (kotId: string) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const updatedKots = kots.map(kot => 
        kot.id === kotId 
          ? { ...kot, status: "pending" } 
          : kot
      );
      
      setKots(updatedKots);
      
      // Show toast notification
      toast({
        title: "KOT Reopened",
        description: `KOT #${kotId} has been reopened`,
      });
      
      setIsLoading(false);
    }, 300);
  };

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...kots];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(kot => 
        kot.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(kot => kot.status === statusFilter);
    }
    
    setFilteredKots(filtered);
  }, [kots, searchTerm, statusFilter]);

  return {
    kots: filteredKots,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleStatusChange,
    handleReopenKOT,
    refreshKOTs
  };
};
