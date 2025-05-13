
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-yellow-100 p-6 rounded-full inline-flex items-center justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-yellow-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="default"
            className="bg-posguard-primary hover:bg-posguard-secondary"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
