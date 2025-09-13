import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Users, Calendar, LogOut, UserCircle } from "lucide-react";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  const menuItems = [
    { label: "Dashboard", icon: Building2, path: "/" },
    { label: "Students", icon: Users, path: "/students" },
    { label: "Meal Log", icon: Calendar, path: "/meal-log" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-primary shadow-elevated min-h-screen">
      {/* Admin Logo */}
      <div className="p-6 border-b border-primary-glow/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-glow/20 rounded-full flex items-center justify-center">
            <UserCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">
              Admin Panel
            </h1>
            <p className="text-xs text-primary-foreground/70">
              Hostel Management
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="space-y-2 px-4 py-6">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            onClick={() => navigate(item.path)}
            className={`w-full justify-start text-primary-foreground hover:bg-primary-glow/20 ${
              isActive(item.path) ? 'bg-primary-glow/30' : ''
            }`}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-primary-foreground hover:bg-destructive/20"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};