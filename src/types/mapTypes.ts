// mapTypes.ts
export enum PinType {
  CURRENT = "current",
  CUSTOM = "custom",
  FUTURE = "future",
  MOBILE_CLINIC = "mobile_clinic" // Add new pin type
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Pin {
  id: string;
  name: string;
  description?: string;
  type: PinType;
  coordinates: Coordinates;
  createdAt: string;
  scheduledFor?: string; // for future destinations only
  userId: string;
}

export interface PinFilters {
  type?: PinType | null;
  search?: string;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  } | null;
}

export interface MapContextType {
  pins: Pin[];
  selectedPin: Pin | null;
  loading: boolean;
  addPin: (pin: Omit<Pin, "id" | "createdAt">) => void;
  updatePin: (id: string, pin: Partial<Omit<Pin, "id" | "createdAt">>) => void;
  deletePin: (id: string) => void;
  selectPin: (id: string | null) => void;
  filterPins: (filters: PinFilters) => Pin[];
}