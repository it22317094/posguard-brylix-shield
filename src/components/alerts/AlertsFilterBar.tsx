
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface AlertsFilterBarProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  handleBulkAcknowledge: () => void;
}

export const AlertsFilterBar: React.FC<AlertsFilterBarProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  handleBulkAcknowledge
}) => {
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {categories.map((category) => (
              <DropdownMenuItem key={category} onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center space-x-2 w-full">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label 
                    htmlFor={`category-${category}`} 
                    className="flex-1 cursor-pointer capitalize"
                  >
                    {category}
                  </label>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        onClick={handleBulkAcknowledge}
        variant="outline"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Acknowledge All
      </Button>
    </div>
  );
};
