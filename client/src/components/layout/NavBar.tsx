import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, User } from "lucide-react";

interface NavBarProps {
  variant: 'landing' | 'app';
}

export const NavBar = ({ variant }: NavBarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (variant === 'landing') {
    return (
      <nav className="bg-background/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">CertPrep</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Button onClick={logout} variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="shadow-md">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // App variant
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Practice", path: "/practice" },
    { label: "Tracks", path: "/tracks" },
    { label: "Analytics", path: "/analytics" },
    { label: "Exam Sim", path: "/exam" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-background/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">CertPrep</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={isActive(item.path) ? "bg-primary/10 text-primary" : ""}
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {user?.name}
            </span>
            <Button onClick={logout} variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};