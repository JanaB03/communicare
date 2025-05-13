import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface AppHeaderProps {
  title: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-10 bg-navy text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {title}
        </h1>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Avatar className="h-8 w-8 border border-white">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-orange text-white">
                    {user.name.substring(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:text-orange hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader