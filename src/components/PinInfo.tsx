import React from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PinType, Pin } from '@/types/mapTypes';
import { MapPin, Calendar, Clock, ArrowRight, Pencil, Trash } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';

interface PinInfoProps {
  onEdit: (pin: Pin) => void;
  className?: string;
}

const PinInfo: React.FC<PinInfoProps> = ({ onEdit, className }) => {
  const { selectedPin, deletePin, selectPin } = useMap();
  
  if (!selectedPin) return null;
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this location?')) {
      deletePin(selectedPin.id);
    }
  };
  
  const handleEdit = () => {
    onEdit(selectedPin);
  };
  
  const handleClose = () => {
    selectPin(null);
  };
  
  const getPinIcon = () => {
    switch (selectedPin.type) {
      case PinType.CURRENT:
        return <MapPin className="h-5 w-5 text-orange" />;
      case PinType.CUSTOM:
        return <MapPin className="h-5 w-5 text-purple" />;
      case PinType.FUTURE:
        return <Calendar className="h-5 w-5 text-sky-blue" />;
    }
  };
  
  const getPinTypeLabel = (): string => {
    switch (selectedPin.type) {
      case PinType.CURRENT:
        return 'Current Location';
      case PinType.CUSTOM:
        return 'Custom Location';
      case PinType.FUTURE:
        return 'Future Destination';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getPinIcon()}
            <span className="font-semibold text-lg">{selectedPin.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="h-7 w-7"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{getPinTypeLabel()}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedPin.description && (
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm">{selectedPin.description}</p>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium mb-1">Coordinates</h4>
          <p className="text-sm">
            {selectedPin.coordinates.latitude.toFixed(6)}, {selectedPin.coordinates.longitude.toFixed(6)}
          </p>
        </div>
        
        {selectedPin.type === PinType.FUTURE && selectedPin.scheduledFor && (
          <div>
            <h4 className="text-sm font-medium mb-1">Scheduled For</h4>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{formatDate(new Date(selectedPin.scheduledFor))}</span>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium mb-1">Created</h4>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{formatDate(new Date(selectedPin.createdAt))}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDelete}
          className="text-destructive"
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PinInfo;