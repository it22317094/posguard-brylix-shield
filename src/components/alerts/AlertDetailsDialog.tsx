
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, X } from "lucide-react";
import { Alert } from "@/types/alert";

interface AlertDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  alert: Alert | null;
  onAcknowledge: (id: number) => void;
}

export const AlertDetailsDialog: React.FC<AlertDetailsDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  alert, 
  onAcknowledge 
}) => {
  if (!alert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {alert.title}
            <Badge variant={
              alert.severity === "high" ? "destructive" : 
              alert.severity === "medium" ? "default" : 
              "outline"
            }>
              {alert.severity}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-3 mt-1">
            <span className="capitalize">{alert.category}</span>
            <span>•</span>
            <span>
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div>
            <h4 className="text-sm font-medium mb-1">Alert Description</h4>
            <p className="text-sm">{alert.description}</p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-1">Detailed Information</h4>
            <p className="text-sm whitespace-pre-line">{alert.details}</p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          {!alert.acknowledged && (
            <Button 
              variant="outline" 
              onClick={() => {
                onAcknowledge(alert.id);
                onOpenChange(false);
              }}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Acknowledge
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
