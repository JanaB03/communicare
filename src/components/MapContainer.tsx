import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinates, Pin, PinType } from '@/types/mapTypes';
import { useMap } from '@/contexts/MapContext';

import 'mapbox-gl/dist/mapbox-gl.css';

// Placeholder for Mapbox token - in production, use environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXlqejEyIiwiYSI6ImNtOXJvMzZjZDA1MGYycnBxOThycXdyb3AifQ.bEikadUdxNNIT8C8Oa7Ibg';

interface MapContainerProps {
  onPinCreate?: (coordinates: Coordinates) => void;
  initialCenter?: Coordinates;
  zoom?: number;
}

const pinColors = {
  [PinType.CURRENT]: '#FF7846', // Orange
  [PinType.CUSTOM]: '#B482FF', // Purple
  [PinType.FUTURE]: '#66C7FF', // Sky Blue
  [PinType.MOBILE_CLINIC]: '#FFA500'
};

const MapContainer: React.FC<MapContainerProps> = ({
  onPinCreate,
  initialCenter = { latitude: 37.0902, longitude: -95.7129 }, // Default to US center
  zoom = 4
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { pins, selectPin, selectedPin } = useMap();

  useEffect(() => {
    // Initialize Mapbox
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialCenter.longitude, initialCenter.latitude],
      zoom: zoom,
    });
    
    // Add navigation controls
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    newMap.on('load', () => {
      setMapLoaded(true);
    });
    
    // Add click handler for adding new pins
    if (onPinCreate) {
      newMap.on('click', (e) => {
        onPinCreate({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      });
    }
    
    map.current = newMap;
    
    return () => {
      newMap.remove();
      map.current = null;
    };
  }, [initialCenter, zoom, onPinCreate]);

  // Update markers when pins change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Remove markers that no longer exist in pins
    Object.keys(markers.current).forEach(id => {
      if (!pins.find(pin => pin.id === id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });
    
    // Add or update markers for each pin
    pins.forEach(pin => {
      const { id, coordinates, type } = pin;
      
      // Create HTML element for marker
      const el = document.createElement('div');
      el.className = 'map-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = pinColors[type];
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';
      
      // Add pulse effect for current location
      if (type === PinType.CURRENT) {
        el.style.position = 'relative';
        
        const pulse = document.createElement('div');
        pulse.style.position = 'absolute';
        pulse.style.top = '-4px';
        pulse.style.left = '-4px';
        pulse.style.right = '-4px';
        pulse.style.bottom = '-4px';
        pulse.style.borderRadius = '50%';
        pulse.style.backgroundColor = `${pinColors[type]}40`;
        pulse.style.animation = 'pulse 2s infinite';
        
        el.appendChild(pulse);
        
        const keyframes = `@keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }`;
        
        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.head.appendChild(style);
      }
      
      // Highlight selected pin
      if (selectedPin && selectedPin.id === id) {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '10';
      }
      
      // Create or update marker
      if (markers.current[id]) {
        markers.current[id].setLngLat([coordinates.longitude, coordinates.latitude]);
      } else {
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .addTo(map.current);
          
        // Add click handler to select pin
        marker.getElement().addEventListener('click', () => {
          selectPin(id);
        });
        
        markers.current[id] = marker;
      }
    });
  }, [pins, mapLoaded, selectedPin, selectPin]);
  
  // Fly to selected pin
  useEffect(() => {
    if (!map.current || !selectedPin) return;
    
    map.current.flyTo({
      center: [selectedPin.coordinates.longitude, selectedPin.coordinates.latitude],
      zoom: 14,
      duration: 1000
    });
  }, [selectedPin]);

  return <div ref={mapContainer} className="h-full w-full rounded-md overflow-hidden" />;
};

export default MapContainer;