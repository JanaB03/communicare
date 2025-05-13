import React, { useState, useEffect } from 'react';
import { useMap } from '@/contexts/MapContext';
import { PinType } from '@/types/mapTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ambulance, MapPin, Clock, Navigation } from 'lucide-react';

// Coordinates for San Diego
const SAN_DIEGO = { latitude: 32.7157, longitude: -117.1611 };

interface MobileClinicTrackerProps {
  isStaffView?: boolean; // Added prop to indicate staff view
}

const MobileClinicTracker: React.FC<MobileClinicTrackerProps> = ({ isStaffView = false }) => {
  const { addPin, pins, selectPin } = useMap();
  const [distance, setDistance] = useState(3.2); // Miles away
  const [eta, setEta] = useState(12); // Minutes
  const [clinicPinId, setClinicPinId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Get the user's current position
  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(userCoords);
          
          // Add user's location pin if not already present
          const userLocationPin = pins.find(p => p.type === PinType.CURRENT);
          if (!userLocationPin) {
            addPin({
              name: isStaffView ? "Client Location" : "My Location",
              type: PinType.CURRENT,
              coordinates: userCoords,
              userId: "1"
            });
          }
          
          // Calculate initial clinic position
          const bearing = Math.random() * 360; // Random direction
          const clinicCoords = calculateCoordinates(userCoords, distance, bearing);
          
          // Add mobile clinic pin
          const clinicPin = addPin({
            name: "Mobile Clinic",
            description: "CommuniCare Mobile Health Services",
            type: PinType.CUSTOM,
            coordinates: clinicCoords,
            userId: "mobile-clinic"
          });
          
          setClinicPinId(clinicPin.id);
          setIsTracking(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use San Diego as fallback location
          setUserLocation(SAN_DIEGO);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation(SAN_DIEGO);
    }
  };
  
  // Calculate new coordinates given a starting point, distance (miles), and bearing (degrees)
  const calculateCoordinates = (start, distanceMiles, bearingDegrees) => {
    // Convert distance from miles to km
    const distanceKm = distanceMiles * 1.60934;
    
    // Earth's radius in km
    const R = 6371;
    
    // Convert degrees to radians
    const bearingRad = (bearingDegrees * Math.PI) / 180;
    const latRad = (start.latitude * Math.PI) / 180;
    const lonRad = (start.longitude * Math.PI) / 180;
    
    // Calculate new position
    const latNew = Math.asin(
      Math.sin(latRad) * Math.cos(distanceKm / R) +
      Math.cos(latRad) * Math.sin(distanceKm / R) * Math.cos(bearingRad)
    );
    
    const lonNew = lonRad + Math.atan2(
      Math.sin(bearingRad) * Math.sin(distanceKm / R) * Math.cos(latRad),
      Math.cos(distanceKm / R) - Math.sin(latRad) * Math.sin(latNew)
    );
    
    // Convert back to degrees
    return {
      latitude: (latNew * 180) / Math.PI,
      longitude: (lonNew * 180) / Math.PI
    };
  };

  // Update mobile clinic position every few seconds to simulate movement
  useEffect(() => {
    if (!isTracking || !clinicPinId || !userLocation) return;
    
    const interval = setInterval(() => {
      // Update distance (bring the clinic closer)
      const newDistance = Math.max(0, distance - 0.1);
      setDistance(newDistance);
      
      // Update ETA
      const newEta = Math.max(0, Math.floor(newDistance * 4)); // Roughly 4 minutes per mile
      setEta(newEta);
      
      // Find clinic pin
      const clinicPin = pins.find(p => p.id === clinicPinId);
      if (clinicPin) {
        // Calculate new position - move clinic closer to user
        const bearing = Math.atan2(
          userLocation.longitude - clinicPin.coordinates.longitude,
          userLocation.latitude - clinicPin.coordinates.latitude
        ) * (180 / Math.PI);
        
        // New coordinates that are closer to the user
        const newCoords = calculateCoordinates(clinicPin.coordinates, 0.1, bearing);
        
        // Update pin with new coordinates
        addPin({
          ...clinicPin,
          coordinates: newCoords
        });
      }
      
      // If the clinic has arrived (distance is very small)
      if (newDistance < 0.1) {
        clearInterval(interval);
        setDistance(0);
        setEta(0);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isTracking, clinicPinId, userLocation, distance, pins, addPin]);

  const trackMobileClinic = () => {
    getCurrentPosition();
  };
  
  const focusOnClinic = () => {
    if (clinicPinId) {
      selectPin(clinicPinId);
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange text-white p-2 rounded-full">
            <Ambulance className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">Mobile Health Clinic</h3>
            <p className="text-sm text-muted-foreground">CommuniCare Services</p>
          </div>
        </div>
        
        {isTracking ? (
          <>
            <div className="space-y-4 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange" />
                <div className="text-sm">
                  <span className="font-medium">{distance.toFixed(1)} miles away from {isStaffView ? 'client' : 'you'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange" />
                <div className="text-sm">
                  <span className="font-medium">ETA: {eta} minutes</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center gap-2"
                onClick={focusOnClinic}
              >
                <Navigation className="h-4 w-4" />
                View on Map
              </Button>
              
              <div className="text-xs text-center text-muted-foreground mt-2">
                Mobile clinic services: vaccinations, health screenings, and basic care
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-sm text-center mb-4">
              {isStaffView 
                ? "Track the mobile health clinic to monitor its location and ETA for clients"
                : "Track the mobile health clinic to see its current location and ETA"}
            </p>
            <Button onClick={trackMobileClinic}>
              {isStaffView ? "Monitor Mobile Clinic" : "Track Mobile Clinic"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileClinicTracker;