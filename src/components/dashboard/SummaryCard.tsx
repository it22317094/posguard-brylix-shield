
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SummaryCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  route: string;
  linkText: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, icon, route, linkText }) => {
  const navigate = useNavigate();

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <CardDescription className="text-2xl font-bold">{count}</CardDescription>
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <Button variant="link" size="sm" className="p-0 h-auto text-posguard-primary" onClick={() => navigate(route)}>
          {linkText} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
