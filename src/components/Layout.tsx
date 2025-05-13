
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  ListTodo, 
  Bell, 
  Activity, 
  Settings, 
  LogOut, 
  Shield, 
  Menu, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { label: "KOT Manager", icon: <ListTodo size={20} />, href: "/kot-manager" },
    { label: "Alerts", icon: <Bell size={20} />, href: "/alerts" },
    { label: "Activity Log", icon: <Activity size={20} />, href: "/activity-log" },
    { label: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];

  return (
    <div className="flex h-screen w-full">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="bg-white shadow-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar w-64 border-r border-sidebar-border h-full flex-shrink-0 fixed lg:relative z-40",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
            <Shield className="h-8 w-8 text-posguard-primary" />
            <div>
              <h2 className="font-bold text-lg leading-none">POSGuard</h2>
              <p className="text-xs text-gray-500">Brylix POS Security</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3">
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <li key={i}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 font-normal",
                      window.location.pathname === item.href && "bg-sidebar-accent font-medium"
                    )}
                    onClick={() => {
                      navigate(item.href);
                      if (isMobile) setSidebarOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-sm">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
              </div>
              <Button
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500"
              >
                <LogOut size={18} />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-center gap-2 text-sm" 
              onClick={() => window.open("https://brylix.com", "_blank")}
            >
              <span>Open Brylix POS</span>
              <span className="text-xs">↗</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto bg-gray-50 relative", 
        isMobile && "pt-16"
      )}>
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
