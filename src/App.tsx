
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import KOTManager from "./pages/KOTManager";
import Alerts from "./pages/Alerts";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/kot-manager" element={
              <ProtectedRoute>
                <KOTManager />
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute allowedRoles={["admin", "cashier"]}>
                <Alerts />
              </ProtectedRoute>
            } />
            <Route path="/activity-log" element={
              <ProtectedRoute allowedRoles={["admin", "cashier"]}>
                <ActivityLog />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Redirect root to dashboard or login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
