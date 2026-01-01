export interface OccupancySummary {
  occupied: number;
  free: number;
  total: number;
  percentage: number;
}

export interface ParkingSpot {
  id: string;
  status: 'free' | 'occupied';
  type: 'regular' | 'electric' | 'disabled' | 'motorcycle';
}

export interface OccupancyData {
  summary: OccupancySummary;
  spots: ParkingSpot[];
  lastUpdated: string;
  cameraId: string;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  date: string;
}
