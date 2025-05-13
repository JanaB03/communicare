import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pin, PinType, Coordinates } from '@/types/mapTypes';
import { useMap } from '@/contexts/MapContext';
import { useUser } from '@/contexts/UserContext';

interface PinFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPin?: Pin | null;
  coordinates?: Coordinates | null;
}

const PinFormDialog: React.FC<PinFormDialogProps> = ({
  open,
  onOpenChange,
  editPin = null,
  coordinates = null
}) => {
  const { user } = useUser();
  const { addPin, updatePin } = useMap();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PinType>(PinType.CUSTOM);
  const [scheduledFor, setScheduledFor] = useState('');
  const [formCoordinates, setFormCoordinates] = useState<Coordinates | null>(null);
  
  // Reset form when dialog opens/closes or when editPin changes
  useEffect(() => {
    if (open) {
      if (editPin) {
        setName(editPin.name);
        setDescription(editPin.description || '');
        setType(editPin.type);
        setScheduledFor(editPin.scheduledFor || '');
        setFormCoordinates(editPin.coordinates);
      } else {
        setName('');
        setDescription('');
        setType(PinType.CUSTOM);
        setScheduledFor('');
        setFormCoordinates(coordinates);
      }
    }
  }, [open, editPin, coordinates]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formCoordinates || !user) return;
    
    const pinData = {
      name,
      description: description.trim() || undefined,
      type,
      coordinates: formCoordinates,
      scheduledFor: type === PinType.FUTURE && scheduledFor ? scheduledFor : undefined,
      userId: user.id
    };
    
    if (editPin) {
      updatePin(editPin.id, pinData);
    } else {
      addPin(pinData);
    }
    
    onOpenChange(false);
  };
  
  const isFormValid = name.trim() !== '' && formCoordinates !== null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editPin ? 'Edit Location' : 'Add New Location'}
            </DialogTitle>
            <DialogDescription>
              {editPin 
                ? 'Update the details for this location' 
                : 'Create a new location pin on the map'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for this location"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Pin Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as PinType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a pin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PinType.CURRENT}>Current Location</SelectItem>
                  <SelectItem value={PinType.CUSTOM}>Custom Location</SelectItem>
                  <SelectItem value={PinType.FUTURE}>Future Destination</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {type === PinType.FUTURE && (
              <div className="grid gap-2">
                <Label htmlFor="scheduled-for">Scheduled For</Label>
                <Input
                  id="scheduled-for"
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  placeholder="Select date and time"
                />
              </div>
            )}
            
            {formCoordinates && (
              <div className="grid gap-2">
                <Label>Coordinates</Label>
                <div className="text-sm text-muted-foreground">
                  Latitude: {formCoordinates.latitude.toFixed(6)}
                  <br />
                  Longitude: {formCoordinates.longitude.toFixed(6)}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              {editPin ? 'Save Changes' : 'Create Pin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PinFormDialog;