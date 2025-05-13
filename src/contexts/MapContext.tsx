import React, { createContext, useContext, ReactNode } from "react";
import { MapContextType, PinFilters } from "@/types/mapTypes";
import useMapPins from "@/hooks/useMapPins";
import { useUser } from "@/contexts/UserContext";

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const userId = user?.id || "anonymous"; // Default to anonymous if no user
  
  const {
    pins,
    selectedPin,
    loading,
    addPin,
    updatePin,
    deletePin,
    selectPin,
    filterPins
  } = useMapPins(userId);

  return (
    <MapContext.Provider
      value={{
        pins,
        selectedPin,
        loading,
        addPin,
        updatePin,
        deletePin,
        selectPin,
        filterPins
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextType => {
  const context = useContext(MapContext);
  
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  
  return context;
};