
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/auth";
import Layout from "@/components/Layout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["admin", "cashier", "kitchen"] 
}) => {
  const { currentUser, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-posguard-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render layout with children
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
