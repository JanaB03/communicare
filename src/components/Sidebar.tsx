import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Navigation,
  Filter,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pin, PinType, PinFilters } from '@/types/mapTypes';
import { useMap } from '@/contexts/MapContext';
import { formatDate } from '@/lib/utils';
import useGeolocation from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onAddPin: () => void;
  onFindMyLocation: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onAddPin, 
  onFindMyLocation, 
  className 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<PinType | null>(null);
  
  const { pins, selectedPin, selectPin, filterPins } = useMap();
  const { loading: locationLoading } = useGeolocation();
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const toggleFilter = (type: PinType | null) => {
    setActiveFilter(activeFilter === type ? null : type);
  };
  
  const filteredPins = filterPins({
    type: activeFilter,
    search: searchTerm
  });

  const getPinIcon = (type: PinType) => {
    switch (type) {
      case PinType.CURRENT:
        return <MapPin className="h-4 w-4 text-orange" />;
      case PinType.CUSTOM:
        return <MapPin className="h-4 w-4 text-purple" />;
      case PinType.FUTURE:
        return <Calendar className="h-4 w-4 text-sky-blue" />;
    }
  };
  
  const getPinTypeLabel = (type: PinType): string => {
    switch (type) {
      case PinType.CURRENT:
        return 'Current Location';
      case PinType.CUSTOM:
        return 'Custom Location';
      case PinType.FUTURE:
        return 'Future Destination';
    }
  };

  if (isCollapsed) {
    return (
      <div className={cn("absolute top-4 left-4 z-10", className)}>
        <Button
          size="icon"
          className="bg-white text-navy hover:bg-gray-100"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col bg-white border rounded-md shadow-md overflow-hidden",
      "w-full md:w-80 h-[calc(100%-2rem)] transition-all duration-300",
      className
    )}>
      {/* Sidebar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-navy">Locations</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-navy hover:bg-gray-100"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search locations..."
            className="pl-8 pr-8"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button 
              className="absolute right-2 top-2.5"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant={activeFilter === null ? "secondary" : "outline"}
            className="text-xs flex-1"
            onClick={() => toggleFilter(null)}
          >
            <Filter className="h-3 w-3 mr-1" />
            All
          </Button>
          <Button 
            size="sm" 
            variant={activeFilter === PinType.CURRENT ? "orange" : "outline"}
            className="text-xs flex-1"
            onClick={() => toggleFilter(PinType.CURRENT)}
          >
            <MapPin className="h-3 w-3 mr-1" />
            Current
          </Button>
          <Button 
            size="sm" 
            variant={activeFilter === PinType.CUSTOM ? "purple" : "outline"}
            className="text-xs flex-1"
            onClick={() => toggleFilter(PinType.CUSTOM)}
          >
            <MapPin className="h-3 w-3 mr-1" />
            Custom
          </Button>
          <Button 
            size="sm" 
            variant={activeFilter === PinType.FUTURE ? "sky-blue" : "outline"}
            className="text-xs flex-1"
            onClick={() => toggleFilter(PinType.FUTURE)}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Future
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            variant="secondary"
            onClick={onFindMyLocation}
            disabled={locationLoading}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Find My Location
          </Button>
          <Button 
            size="sm" 
            className="flex-1" 
            onClick={onAddPin}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pin
          </Button>
        </div>
      </div>
      
      {/* Pin List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredPins.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm 
                ? "No locations match your search" 
                : "No locations saved yet"}
            </p>
          ) : (
            filteredPins.map((pin) => (
              <div 
                key={pin.id}
                className={cn(
                  "p-3 border rounded-md cursor-pointer transition-all",
                  "hover:bg-gray-50",
                  selectedPin?.id === pin.id ? "border-primary bg-primary/5" : "border-border"
                )}
                onClick={() => selectPin(pin.id)}
              >
                <div className="flex items-center gap-2">
                  {getPinIcon(pin.type)}
                  <span className="font-medium">{pin.name}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex flex-col">
                  <span>{getPinTypeLabel(pin.type)}</span>
                  {pin.type === PinType.FUTURE && pin.scheduledFor && (
                    <span className="mt-1">
                      Scheduled: {formatDate(new Date(pin.scheduledFor))}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;