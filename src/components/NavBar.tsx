import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Map, LifeBuoy, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useUser();
  
  const linkClass = "flex items-center px-4 py-2 text-sm font-medium transition-colors";
  const activeClass = "text-orange";
  const inactiveClass = "text-white hover:text-orange";

  return (
    <div className="fixed top-0 left-0 right-0 bg-navy shadow-md flex justify-between items-center py-2 px-4 z-50">
      {/* Logo and brand */}
      <Link to="/" className="text-white font-bold text-xl">
        CommuniCare
      </Link>
      
      {/* Main navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <Link 
          to="/" 
          className={cn(linkClass, location.pathname === '/' ? activeClass : inactiveClass)}
        >
          <Home className="h-5 w-5 mr-2" />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/chat" 
          className={cn(linkClass, location.pathname === '/chat' ? activeClass : inactiveClass)}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          <span>Chat</span>
        </Link>
        
        <Link 
          to="/map" 
          className={cn(linkClass, location.pathname === '/map' ? activeClass : inactiveClass)}
        >
          <Map className="h-5 w-5 mr-2" />
          <span>Map</span>
        </Link>
        
        <Link 
          to="/resources" 
          className={cn(linkClass, location.pathname === '/resources' ? activeClass : inactiveClass)}
        >
          <LifeBuoy className="h-5 w-5 mr-2" />
          <span>Resources</span>
        </Link>
      </div>
      
      {/* User section */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/settings" 
          className={cn(linkClass, location.pathname === '/settings' ? activeClass : inactiveClass)}
        >
          <Settings className="h-5 w-5" />
        </Link>
        
        {user && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-white">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-orange text-white">
                  {user.name.substring(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-white text-sm hidden md:inline">{user.name}</span>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={signOut}
              className="text-navy bg-orange hover:bg-orange/90 ml-2"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-navy border-t border-navy-light flex justify-around items-center py-2 z-50">
        <Link 
          to="/" 
          className={cn("flex flex-col items-center p-2", location.pathname === '/' ? activeClass : inactiveClass)}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/chat" 
          className={cn("flex flex-col items-center p-2", location.pathname === '/chat' ? activeClass : inactiveClass)}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        
        <Link 
          to="/map" 
          className={cn("flex flex-col items-center p-2", location.pathname === '/map' ? activeClass : inactiveClass)}
        >
          <Map className="h-5 w-5" />
          <span className="text-xs mt-1">Map</span>
        </Link>
        
        <Link 
          to="/resources" 
          className={cn("flex flex-col items-center p-2", location.pathname === '/resources' ? activeClass : inactiveClass)}
        >
          <LifeBuoy className="h-5 w-5" />
          <span className="text-xs mt-1">Resources</span>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;