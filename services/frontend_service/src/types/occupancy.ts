export interface OccupancySummary {
  occupied: number;
  free: number;
  total: number;
}

export interface OccupancyAreas {
  [areaName: string]: boolean;
}

export interface OccupancyData {
  summary: OccupancySummary;
  areas: OccupancyAreas;
  timestamp: string;
}

export interface OccupancyError {
  message: string;
  code?: string;
}
