import { useState, useCallback, useEffect } from "react";
import { Pin, PinFilters, PinType } from "@/types/mapTypes";

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useMapPins = (userId: string) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load pins from localStorage on initial render
  useEffect(() => {
    const loadPins = () => {
      const savedPins = localStorage.getItem("communicare_pins");
      if (savedPins) {
        const parsedPins = JSON.parse(savedPins) as Pin[];
        // Only load pins for the current user
        setPins(parsedPins.filter(pin => pin.userId === userId));
      }
      setLoading(false);
    };
    
    loadPins();
  }, [userId]);
  
  // Save pins to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      const allPins = JSON.parse(localStorage.getItem("communicare_pins") || "[]");
      // Remove this user's pins
      const otherUserPins = allPins.filter((pin: Pin) => pin.userId !== userId);
      // Add this user's pins
      localStorage.setItem("communicare_pins", JSON.stringify([...otherUserPins, ...pins]));
    }
  }, [pins, userId, loading]);
  
  const addPin = useCallback((pin: Omit<Pin, "id" | "createdAt">) => {
    const newPin: Pin = {
      ...pin,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    setPins(prev => [...prev, newPin]);
    return newPin;
  }, []);
  
  const updatePin = useCallback((id: string, updates: Partial<Omit<Pin, "id" | "createdAt">>) => {
    setPins(prev => 
      prev.map(pin => 
        pin.id === id 
          ? { ...pin, ...updates } 
          : pin
      )
    );
    
    // Update selected pin if it's the one being edited
    if (selectedPin?.id === id) {
      setSelectedPin(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedPin]);
  
  const deletePin = useCallback((id: string) => {
    setPins(prev => prev.filter(pin => pin.id !== id));
    
    // Deselect pin if it's the one being deleted
    if (selectedPin?.id === id) {
      setSelectedPin(null);
    }
  }, [selectedPin]);
  
  const selectPin = useCallback((id: string | null) => {
    if (!id) {
      setSelectedPin(null);
      return;
    }
    
    const pin = pins.find(p => p.id === id);
    setSelectedPin(pin || null);
  }, [pins]);
  
  const filterPins = useCallback((filters: PinFilters): Pin[] => {
    return pins.filter(pin => {
      // Filter by type
      if (filters.type && pin.type !== filters.type) {
        return false;
      }
      
      // Filter by search term
      if (filters.search && filters.search.trim() !== "") {
        const searchTerm = filters.search.toLowerCase();
        const nameMatch = pin.name.toLowerCase().includes(searchTerm);
        const descMatch = pin.description?.toLowerCase().includes(searchTerm) || false;
        
        if (!nameMatch && !descMatch) {
          return false;
        }
      }
      
      // Filter by date range
      if (filters.dateRange) {
        const pinDate = new Date(pin.type === PinType.FUTURE && pin.scheduledFor 
          ? pin.scheduledFor 
          : pin.createdAt);
          
        if (filters.dateRange.from && pinDate < filters.dateRange.from) {
          return false;
        }
        
        if (filters.dateRange.to && pinDate > filters.dateRange.to) {
          return false;
        }
      }
      
      return true;
    });
  }, [pins]);
  
  return {
    pins,
    selectedPin,
    loading,
    addPin,
    updatePin,
    deletePin,
    selectPin,
    filterPins
  };
};

export default useMapPins;