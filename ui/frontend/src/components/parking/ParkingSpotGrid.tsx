import { Car, Zap, Accessibility, Bike, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ParkingSpot } from '@/types/occupancy';

interface ParkingSpotGridProps {
  spots: ParkingSpot[];
  limit?: number;
}

const spotIcons = {
  regular: Car,
  electric: Zap,
  disabled: Accessibility,
  motorcycle: Bike,
};

export default function ParkingSpotGrid({ spots, limit }: ParkingSpotGridProps) {
  const displaySpots = limit ? spots.slice(0, limit) : spots;
  const remaining = limit && spots.length > limit ? spots.length - limit : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {displaySpots.map((spot) => {
          const Icon = spot.status === 'occupied' ? X : spotIcons[spot.type];
          const isOccupied = spot.status === 'occupied';

          return (
            <div
              key={spot.id}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg p-3 aspect-square transition-all',
                isOccupied
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-success text-success-foreground'
              )}
              role="status"
              aria-label={`Espacio ${spot.id}: ${isOccupied ? 'ocupado' : 'libre'}`}
            >
              <Icon className="h-6 w-6 mb-1" aria-hidden="true" />
              <p className="text-xs font-bold truncate w-full text-center">{spot.id}</p>
            </div>
          );
        })}
      </div>

      {remaining > 0 && (
        <div className="flex items-center justify-center rounded-lg bg-card border border-border p-3">
          <p className="text-sm font-bold text-muted-foreground">
            +{remaining} más plaza{remaining !== 1 ? 's' : ''} disponible{remaining !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
