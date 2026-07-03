import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { OccupancySummary as OccupancySummaryType } from '@/types/occupancy';

interface OccupancySummaryProps {
  summary: OccupancySummaryType;
}

export default function OccupancySummary({ summary }: OccupancySummaryProps) {
  const getStatusColor = (free: number, total: number) => {
    const percentage = (free / total) * 100;
    if (percentage > 20) return 'text-primary';
    if (percentage > 10) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Plazas Disponibles</span>
          <div className="text-right">
            <p
              className={cn(
                'text-4xl font-bold',
                getStatusColor(summary.free, summary.total)
              )}
            >
              {summary.free}
            </p>
            <p className="text-sm text-muted-foreground">de {summary.total} totales</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ocupados</span>
            <span className="font-bold text-destructive">{summary.occupied}</span>
          </div>
          <div
            className="w-full flex h-2 overflow-hidden border border-border"
            role="progressbar"
            aria-valuenow={summary.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${summary.percentage}% de espacios disponibles`}
          >
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${summary.percentage}%` }}
            />
            <div
              className="h-full bg-destructive transition-all duration-500"
              style={{ width: `${100 - summary.percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
