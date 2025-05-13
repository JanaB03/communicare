import { useState, useEffect, useCallback } from "react";
import { Coordinates } from "@/types/mapTypes";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  loading: boolean;
}

const useGeolocation = (watch = false) => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true,
  });

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      error: null,
      loading: false,
    });
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    setState(prev => ({
      ...prev,
      error: error.message,
      loading: false,
    }));
  }, []);

  const getCurrentLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }));
    
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    });
  }, [onSuccess, onError]);

  useEffect(() => {
    if (watch) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
      
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
      
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      getCurrentLocation();
    }
  }, [watch, getCurrentLocation, onSuccess, onError]);

  return { ...state, getCurrentLocation };
};

export default useGeolocation;