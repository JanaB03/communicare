import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import MapContainer from '@/components/MapContainer';
import Sidebar from '@/components/Sidebar';
import PinInfo from '@/components/PinInfo';
import PinFormDialog from '@/components/PinFormDialog';
import MobileClinicTracker from '@/components/MobileClinicTracker';
import useGeolocation from '@/hooks/useGeolocation';
import { Coordinates, Pin } from '@/types/mapTypes';
import { useMap } from '@/contexts/MapContext';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPin } = useMap();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);
  const [clickedCoordinates, setClickedCoordinates] = useState<Coordinates | null>(null);
  const [showClinicTracker, setShowClinicTracker] = useState(false);
  
  const { coordinates: currentLocation, getCurrentLocation, loading: locationLoading } = useGeolocation();
  
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

  return (
    <div className="flex flex-col h-screen">
     
      
      {/* Added pb-16 to add bottom padding for the navigation bar */}
      <div className="flex-1 relative overflow-hidden pb-16">
        <MapContainer 
          onPinCreate={handleMapClick}
          initialCenter={currentLocation || undefined}
          zoom={currentLocation ? 14 : 4}
        />
        
        <Sidebar 
          onAddPin={handleAddPin}
          onFindMyLocation={handleFindMyLocation}
          className="absolute top-4 left-4 z-10"
        />
        
        {selectedPin && (
          <PinInfo 
            onEdit={handleEditPin}
            // Adjusted bottom position to prevent overlap with the navigation bar
            className="absolute bottom-20 right-4 w-80 z-10"
          />
        )}
        
        {/* Mobile Clinic Tracker Card */}
        <div className="absolute top-4 right-4 w-80 z-10">
          <div className="flex flex-col space-y-2">
            {!showClinicTracker && (
              <button 
                onClick={toggleClinicTracker}
                className="bg-white border p-3 rounded-md shadow-md hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-orange text-white p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19h6M7 19h14v-7a6 6 0 0 0-6-6H9a6 6 0 0 0-6 6v7h4" />
                      <path d="M8 19v2"/>
                      <path d="M16 19v2"/>
                    </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button>
                <MobileClinicTracker />
              </div>
            )}
          </div>
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