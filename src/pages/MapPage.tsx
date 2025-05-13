import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import MapContainer from '@/components/MapContainer';
import Sidebar from '@/components/Sidebar';
import PinInfo from '@/components/PinInfo';
import PinFormDialog from '@/components/PinFormDialog';
import MobileClinicTracker from '@/components/MobileClinicTracker';
import useGeolocation from '@/hooks/useGeolocation';
import { Coordinates, Pin } from '@/types/mapTypes';
import { useMap } from '@/contexts/MapContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Navigation, Plus, Ambulance, X } from 'lucide-react';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPin } = useMap();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);
  const [clickedCoordinates, setClickedCoordinates] = useState<Coordinates | null>(null);
  const [showClinicTracker, setShowClinicTracker] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { coordinates: currentLocation, getCurrentLocation, loading: locationLoading } = useGeolocation();

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  const handleAddPin = useCallback(() => {
    setEditingPin(null);
    setClickedCoordinates(currentLocation || null);
    setFormOpen(true);
  }, [currentLocation]);
  
  const handleFindMyLocation = useCallback(() => {
    getCurrentLocation();
    
    if (currentLocation) {
      // Move map to current location
      setClickedCoordinates({ ...currentLocation });
    }
  }, [getCurrentLocation, currentLocation]);
  
  const handleMapClick = useCallback((coordinates: Coordinates) => {
    setClickedCoordinates(coordinates);
    setEditingPin(null);
    setFormOpen(true);
  }, []);
  
  const handleEditPin = useCallback((pin: Pin) => {
    setEditingPin(pin);
    setClickedCoordinates(null);
    setFormOpen(true);
  }, []);

  const toggleClinicTracker = useCallback(() => {
    setShowClinicTracker(!showClinicTracker);
  }, [showClinicTracker]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  return (
    <div className="flex flex-col h-screen">
      
      
      <div className="flex-1 relative overflow-hidden pb-16">
        <MapContainer 
          onPinCreate={handleMapClick}
          initialCenter={currentLocation || undefined}
          zoom={currentLocation ? 14 : 4}
        />
        
        {/* Mobile-friendly sidebar with toggle button */}
        <div className={`absolute top-4 left-4 z-10 transition-all duration-300 ${isSidebarCollapsed ? 'w-auto' : 'w-full max-w-[90vw] md:max-w-[320px]'}`}>
          {isSidebarCollapsed ? (
            <Button
              variant="secondary"
              size="icon"
              className="bg-white shadow-md h-10 w-10 rounded-md flex items-center justify-center"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Sidebar 
              onAddPin={handleAddPin}
              onFindMyLocation={handleFindMyLocation}
              className="shadow-md"
            />
          )}
        </div>
        
        {/* Mobile action buttons - fixed at bottom for easy thumb access */}
        {isMobile && isSidebarCollapsed && (
          <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-3 z-20 px-4">
            <div className="flex flex-col items-center">
              <Button 
                size="lg"
                className="bg-navy text-white rounded-full h-12 w-12 shadow-lg flex items-center justify-center mb-1"
                onClick={handleFindMyLocation}
                disabled={locationLoading}
              >
                <Navigation className="h-5 w-5" />
              </Button>
              <span className="text-xs text-white bg-navy/70 px-2 py-0.5 rounded-full">My Location</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Button 
                size="lg"
                className="bg-orange text-white rounded-full h-12 w-12 shadow-lg flex items-center justify-center mb-1"
                onClick={handleAddPin}
              >
                <Plus className="h-5 w-5" />
              </Button>
              <span className="text-xs text-white bg-orange/70 px-2 py-0.5 rounded-full">Add Pin</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Button 
                size="lg"
                className="bg-purple text-white rounded-full h-12 w-12 shadow-lg flex items-center justify-center mb-1"
                onClick={toggleClinicTracker}
              >
                <Ambulance className="h-5 w-5" />
              </Button>
              <span className="text-xs text-white bg-purple/70 px-2 py-0.5 rounded-full">Mobile Clinic</span>
            </div>
          </div>
        )}
        
        {/* Selected Pin Info - adjusts for mobile */}
        {selectedPin && (
          <PinInfo 
            onEdit={handleEditPin}
            className={`absolute z-10 max-w-[90vw] md:max-w-[320px] ${
              isMobile 
                ? 'bottom-20 left-1/2 transform -translate-x-1/2 w-[90%]' 
                : 'bottom-20 right-4 w-80'
            }`}
          />
        )}
        
        {/* Mobile Clinic Tracker Card - repositioned for mobile */}
        <div className={`${
          isMobile ? 'absolute top-16 right-4 left-4 max-w-none' : 'absolute top-4 right-4 w-80'
        } z-10 transition-all duration-300`}>
          {!isSidebarCollapsed && !showClinicTracker && !isMobile && (
            <button 
              onClick={toggleClinicTracker}
              className="bg-white border p-3 rounded-md shadow-md hover:bg-gray-50 transition-colors text-left w-full"
            >
              <div className="flex items-center gap-2">
                <div className="bg-orange text-white p-1 rounded-full">
                  <Ambulance className="h-4 w-4" />
                </div>
                <span>Track Mobile Clinic</span>
              </div>
            </button>
          )}
          
          {showClinicTracker && (
            <div className="relative">
              <button 
                className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full text-gray-500 flex items-center justify-center z-20 shadow-sm"
                onClick={toggleClinicTracker}
              >
                <X className="h-4 w-4" />
              </button>
              <MobileClinicTracker />
            </div>
          )}
        </div>
        
        <PinFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          editPin={editingPin}
          coordinates={clickedCoordinates}
        />
      </div>
    </div>
  );
};

export default MapPage;