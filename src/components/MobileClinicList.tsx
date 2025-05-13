import React, { useState, useCallback } from 'react';
import { PinType } from '@/types/mapTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMap } from '@/contexts/MapContext';
import { 
  Ambulance, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckSquare,
  X
} from 'lucide-react';

const MobileClinicList = () => {
  const { pins, selectPin } = useMap();
  const [showDetails, setShowDetails] = useState<string[]>([]);
  
  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  // Define mock mobile clinics
  const mobileClinicSchedule = [
    {
      id: 'clinic-1',
      name: 'Imperial Street Clinic',
      location: 'Imperial Ave & 30th St',
      time: '10:00 AM - 2:00 PM',
      services: ['Vaccinations', 'Health Screenings', 'Basic Care'],
      tracking: true // This one has a pin on the map
    },
    {
      id: 'clinic-2',
      name: 'Downtown Mobile Unit',
      location: 'Civic Center Plaza',
      time: '9:00 AM - 12:00 PM',
      services: ['STI Testing', 'Mental Health', 'Consultations'],
      tracking: false // This one doesn't have a pin yet
    },
    {
      id: 'clinic-3',
      name: 'East Village Outreach',
      location: 'Market St & 14th St',
      time: '1:00 PM - 5:00 PM',
      services: ['Blood Pressure', 'Diabetes Screening', 'Counseling'],
      tracking: false
    }
  ];

  // Toggle clinic details
  const toggleDetails = (clinicId: string) => {
    setShowDetails(prev => 
      prev.includes(clinicId)
        ? prev.filter(id => id !== clinicId)
        : [...prev, clinicId]
    );
  };
  
  // Find mobile clinic pin
  const findClinicPin = (clinicName: string) => {
    return pins.find(pin => 
      pin.type === PinType.MOBILE_CLINIC && 
      pin.name.includes(clinicName.split(' ')[0]) // Match the first word of the clinic name
    );
  };
  
  // Focus on a clinic's pin on the map
  const focusOnClinic = (clinicName: string) => {
    const clinicPin = findClinicPin(clinicName);
    if (clinicPin) {
      selectPin(clinicPin.id);
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange text-white p-2 rounded-full">
              <Ambulance className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Mobile Clinics</h3>
              <p className="text-xs text-muted-foreground">{today}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {mobileClinicSchedule.map(clinic => {
            const isDetailVisible = showDetails.includes(clinic.id);
            const clinicPin = findClinicPin(clinic.name);
            
            return (
              <div key={clinic.id} className="border rounded-md overflow-hidden">
                <div 
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleDetails(clinic.id)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange" />
                    <span className="font-medium">{clinic.name}</span>
                  </div>
                  <button className="h-5 w-5 flex items-center justify-center text-gray-500">
                    {isDetailVisible ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    )}
                  </button>
                </div>
                
                {isDetailVisible && (
                  <div className="px-3 pb-3 pt-1 border-t bg-gray-50">
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{clinic.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{clinic.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{clinic.services.join(', ')}</span>
                      </div>
                    </div>
                    
                    {clinic.tracking && clinicPin && (
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          focusOnClinic(clinic.name);
                        }}
                      >
                        Track on Map
                      </Button>
                    )}
                    
                    {!clinic.tracking && (
                      <div className="text-xs text-center text-muted-foreground">
                        No real-time tracking available
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Scheduled Visits</h4>
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Downtown Mobile Unit</p>
              <p className="text-xs text-muted-foreground">Tomorrow, 9:00 AM</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full text-xs">
            View Full Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileClinicList;