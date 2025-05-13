// src/pages/SettingsPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Bell, 
  Globe, 
  Accessibility, 
  CheckCircle, 
  User, 
  FileText, 
  HelpCircle,
  ChevronRight,
  PenLine,
  Moon,
  Sun,
  LogOut,
  MapPin,
  Type
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Simple Toggle component to use instead of Switch
const ToggleButton = ({ 
  checked, 
  onCheckedChange, 
  className = "" 
}: { 
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) => {
  return (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        checked ? 'bg-orange' : 'bg-gray-200'
      } transition-colors focus:outline-none ${className}`}
      onClick={() => onCheckedChange(!checked)}
      type="button"
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Available languages
const languages = [
  { id: 'english', name: 'English', localName: 'English' },
  { id: 'spanish', name: 'Spanish', localName: 'Español' },
  { id: 'french', name: 'French', localName: 'Français' },
  { id: 'chinese', name: 'Chinese', localName: '中文' }
];

// Type for language settings
interface LanguageOption {
  id: string;
  name: string;
  localName: string;
}

// Storage keys for settings
const STORAGE_KEYS = {
  DARK_MODE: 'communicare_dark_mode',
  LANGUAGE: 'communicare_language',
  HIGH_CONTRAST: 'communicare_high_contrast',
  LARGE_TEXT: 'communicare_large_text',
  NOTIFICATIONS: 'communicare_notifications',
  LOCATION_SHARING: 'communicare_location_sharing'
};

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  
  // State for settings
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [language, setLanguage] = useState<string>('english');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  
  // Dialog states
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Profile edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState('');
  
  // Load settings from localStorage on mount
  useEffect(() => {
    // Dark mode
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (savedDarkMode) {
      const isDarkMode = JSON.parse(savedDarkMode);
      setDarkMode(isDarkMode);
      applyDarkMode(isDarkMode);
    }
    
    // Language
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // High contrast
    const savedHighContrast = localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST);
    if (savedHighContrast) {
      const isHighContrast = JSON.parse(savedHighContrast);
      setHighContrast(isHighContrast);
      applyHighContrast(isHighContrast);
    }
    
    // Large text
    const savedLargeText = localStorage.getItem(STORAGE_KEYS.LARGE_TEXT);
    if (savedLargeText) {
      const isLargeText = JSON.parse(savedLargeText);
      setLargeText(isLargeText);
      applyLargeText(isLargeText);
    }
    
    // Notifications
    const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    // Location sharing
    const savedLocationSharing = localStorage.getItem(STORAGE_KEYS.LOCATION_SHARING);
    if (savedLocationSharing) {
      setShareLocation(JSON.parse(savedLocationSharing));
    }
  }, []);
  
  // Apply dark mode to the document
  const applyDarkMode = (isDarkMode: boolean) => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
  };
  
  // Apply high contrast to the document
  const applyHighContrast = (isHighContrast: boolean) => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, JSON.stringify(isHighContrast));
  };
  
  // Apply large text to the document
  const applyLargeText = (isLargeText: boolean) => {
    if (isLargeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    localStorage.setItem(STORAGE_KEYS.LARGE_TEXT, JSON.stringify(isLargeText));
  };
  
  // Toggle dark mode
  const toggleDarkMode = (isDarkMode: boolean) => {
    setDarkMode(isDarkMode);
    applyDarkMode(isDarkMode);
  };
  
  // Toggle high contrast
  const toggleHighContrast = (isHighContrast: boolean) => {
    setHighContrast(isHighContrast);
    applyHighContrast(isHighContrast);
  };
  
  // Toggle large text
  const toggleLargeText = (isLargeText: boolean) => {
    setLargeText(isLargeText);
    applyLargeText(isLargeText);
  };
  
  // Toggle notifications
  const toggleNotifications = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(enabled));
    
    // Request notification permissions if enabled
    if (enabled && "Notification" in window) {
      Notification.requestPermission();
    }
  };
  
  // Toggle location sharing
  const toggleLocationSharing = (enabled: boolean) => {
    setShareLocation(enabled);
    localStorage.setItem(STORAGE_KEYS.LOCATION_SHARING, JSON.stringify(enabled));
    
    // Request location permissions if enabled
    if (enabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {}, // Success callback - do nothing
        () => {}, // Error callback - do nothing
        { enableHighAccuracy: true }
      );
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  // Handle profile update
  const handleUpdateProfile = () => {
    // In a real app, this would update the user profile in a database
    // For now, we just close the dialog
    setShowProfileDialog(false);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
    
    // Apply language change to the app
    document.documentElement.lang = newLanguage;
    
    // In a real app, this would trigger loading translations
    // For this demo, we'll just close the dialog
    setShowLanguageDialog(false);
  };
  
  // Get the current language object
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.id === language) || languages[0];
  };

  // Define styles for high contrast and large text
  // Apply these styles when the app first loads
  useEffect(() => {
    // Add CSS for high contrast mode
    const highContrastStyles = document.createElement('style');
    highContrastStyles.textContent = `
      .high-contrast {
        --background: #000000;
        --foreground: #FFFFFF;
        --muted: #333333;
        --muted-foreground: #FFFFFF;
      }
      
      .high-contrast body {
        background-color: #000000;
        color: #FFFFFF;
      }
      
      .high-contrast .bg-white {
        background-color: #000000 !important;
        color: #FFFFFF !important;
        border: 2px solid #FFFFFF !important;
      }
      
      .high-contrast .text-muted-foreground {
        color: #FFFFFF !important;
        opacity: 0.8;
      }
      
      .high-contrast button:not([disabled]) {
        border: 2px solid #FFFFFF !important;
      }
    `;
    
    // Add CSS for large text mode
    const largeTextStyles = document.createElement('style');
    largeTextStyles.textContent = `
      .large-text {
        font-size: 120% !important;
      }
      
      .large-text h1, .large-text h2, .large-text h3, .large-text h4 {
        font-size: 130% !important;
      }
      
      .large-text .text-sm {
        font-size: 110% !important;
      }
      
      .large-text .text-xs {
        font-size: 100% !important;
      }
    `;
    
    document.head.appendChild(highContrastStyles);
    document.head.appendChild(largeTextStyles);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(highContrastStyles);
      document.head.removeChild(largeTextStyles);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-20">
     
      
      <main className="flex-1 p-4">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-orange">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-orange text-white text-lg">
                  {user?.name.substring(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.role === 'case_manager' ? 'Case Manager' : 'Client'}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setShowProfileDialog(true)}
            >
              <PenLine className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
        
        {/* Settings Categories */}
        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="font-medium mb-3 text-navy">Appearance</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {darkMode ? (
                      <Moon className="h-4 w-4 text-navy" />
                    ) : (
                      <Sun className="h-4 w-4 text-orange" />
                    )}
                  </div>
                  <div>
                    <span>Dark Mode</span>
                    <p className="text-xs text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <ToggleButton 
                  checked={darkMode} 
                  onCheckedChange={toggleDarkMode} 
                />
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div>
            <h3 className="font-medium mb-3 text-navy">Notifications</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-orange" />
                  </div>
                  <div>
                    <span>Push Notifications</span>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts about important updates
                    </p>
                  </div>
                </div>
                <ToggleButton 
                  checked={notifications} 
                  onCheckedChange={toggleNotifications} 
                />
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-orange" />
                  </div>
                  <div>
                    <span>Location Sharing</span>
                    <p className="text-xs text-muted-foreground">
                      Allow your case manager to see your location
                    </p>
                  </div>
                </div>
                <ToggleButton 
                  checked={shareLocation} 
                  onCheckedChange={toggleLocationSharing} 
                />
              </div>
            </div>
          </div>
          
          {/* Language & Accessibility */}
          <div>
            <h3 className="font-medium mb-3 text-navy">Language & Accessibility</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button 
                className="w-full p-4 border-b flex items-center justify-between"
                onClick={() => setShowLanguageDialog(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-navy" />
                  </div>
                  <div className="text-left">
                    <span>Language</span>
                    <p className="text-xs text-muted-foreground">
                      {getCurrentLanguage().name}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Accessibility className="h-4 w-4 text-navy" />
                  </div>
                  <div>
                    <span>High Contrast</span>
                    <p className="text-xs text-muted-foreground">
                      Increase visual contrast for readability
                    </p>
                  </div>
                </div>
                <ToggleButton 
                  checked={highContrast} 
                  onCheckedChange={toggleHighContrast}
                />
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Type className="h-4 w-4 text-navy" />
                  </div>
                  <div>
                    <span>Large Text</span>
                    <p className="text-xs text-muted-foreground">
                      Increase text size for better readability
                    </p>
                  </div>
                </div>
                <ToggleButton 
                  checked={largeText} 
                  onCheckedChange={toggleLargeText}
                />
              </div>
            </div>
          </div>
          
          {/* Account & Privacy */}
          <div>
            <h3 className="font-medium mb-3 text-navy">Account & Privacy</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-orange" />
                  </div>
                  <div>
                    <span>Verification Status</span>
                    <p className="text-xs text-green-600 font-medium">
                      Verified
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              </div>
              
              <button 
                className="w-full p-4 border-b flex items-center justify-between"
                onClick={() => {/* Navigate to data page */}}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-navy" />
                  </div>
                  <div className="text-left">
                    <span>Export or Delete Data</span>
                    <p className="text-xs text-muted-foreground">
                      Download or remove your personal data
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              
              <button 
                className="w-full p-4 flex items-center justify-between"
                onClick={() => {/* Navigate to help page */}}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-navy" />
                  </div>
                  <div className="text-left">
                    <span>Help & Support</span>
                    <p className="text-xs text-muted-foreground">
                      Get assistance with the app
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          {/* Log Out */}
          <Button 
            variant="outline" 
            className="w-full mt-6 border-red-300 text-red-500 gap-2"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </main>
      
      {/* Edit Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={editEmail} 
                onChange={(e) => setEditEmail(e.target.value)} 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={editPhone} 
                onChange={(e) => setEditPhone(e.target.value)} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Language Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              {languages.map(lang => (
                <button 
                  key={lang.id}
                  className={`w-full p-3 rounded-md flex items-center justify-between ${language === lang.id ? 'bg-orange/10 border border-orange' : 'border'}`}
                  onClick={() => handleLanguageChange(lang.id)}
                >
                  <span>{lang.localName} ({lang.name})</span>
                  {language === lang.id && (
                    <CheckCircle className="h-4 w-4 text-orange" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to sign out of CommuniCare Connect?</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;