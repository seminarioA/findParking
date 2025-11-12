import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { getOccupancy } from '@/lib/api/occupancy';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import type { OccupancyData } from '@/types/occupancy';
import { cn } from '@/lib/utils';

interface OccupancyProps {
  cameraId: string;
  token: string;
}

export default function Occupancy({ cameraId, token }: OccupancyProps) {
  const [data, setData] = useState<OccupancyData | null>(null);
  const [error, setError] = useState('');
  const [animatedOccupied, setAnimatedOccupied] = useState(0);
  const [animatedFree, setAnimatedFree] = useState(0);
  const { speak, isSupported: isSpeechSupported, isSpeaking } = useSpeechSynthesis();

  const wsProtocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const wsUrl = `${wsProtocol}${window.location.host}/api/occupancy/${cameraId}/ws?token=Bearer%20${encodeURIComponent(token)}`;

  const { error: wsError } = useWebSocket(wsUrl, {
    onMessage: (newData: OccupancyData) => {
      setData(newData);
      setError('');
    },
    onError: () => {
      setError('Error de conexión en tiempo real');
    },
  });

  useEffect(() => {
    getOccupancy(cameraId, token)
      .then(setData)
      .catch(() => setError('No se pudo obtener información de ocupación'));
  }, [cameraId, token]);

  useEffect(() => {
    if (!data) return;

    let frame: number;
    const startOccupied = animatedOccupied;
    const startFree = animatedFree;
    const endOccupied = data.summary.occupied;
    const endFree = data.summary.free;
    const duration = 500;
    let startTime: number | null = null;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setAnimatedOccupied(Math.round(startOccupied + (endOccupied - startOccupied) * progress));
      setAnimatedFree(Math.round(startFree + (endFree - startFree) * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [data?.summary.occupied, data?.summary.free]);

  const handleSpeak = () => {
    if (!data || !isSpeechSupported) return;
    const message =
      data.summary.free > 0
        ? `Hay ${data.summary.free} espacios disponibles`
        : 'No hay espacios disponibles en este momento';
    speak(message);
  };

  const getStatusColor = (free: number) => {
    if (free > 1) return 'text-blue-600 dark:text-blue-400';
    if (free === 1) return 'text-green-600 dark:text-green-400';
    return 'text-destructive';
  };

  if (error && !data) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Cargando información de ocupación...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full" role="region" aria-label="Información de ocupación de estacionamiento">
      {isSpeechSupported && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-base">Escucha la disponibilidad</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={handleSpeak}
              disabled={isSpeaking}
              size="lg"
              className="gap-2"
              aria-label="Escuchar disponibilidad de espacios"
            >
              <Volume2 className="h-5 w-5" aria-hidden="true" />
              {isSpeaking ? 'Reproduciendo...' : 'Escuchar disponibilidad'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Resumen de ocupación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center" role="status" aria-live="polite">
              <p className={cn('text-5xl font-bold', getStatusColor(data.summary.free))}>
                {animatedFree}
              </p>
              <p className="text-sm font-semibold text-muted-foreground mt-2">Espacios libres</p>
            </div>
            <div className="text-3xl font-bold text-muted-foreground">/</div>
            <div className="text-center" role="status" aria-live="polite">
              <p className="text-5xl font-bold text-destructive">{animatedOccupied}</p>
              <p className="text-sm font-semibold text-muted-foreground mt-2">Espacios ocupados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de espacios - Cámara {cameraId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" role="list">
            {Object.entries(data.areas).map(([area, isOccupied]) => (
              <div
                key={area}
                className={cn(
                  'p-4 rounded-lg flex flex-col items-center gap-2 transition-colors',
                  isOccupied
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-green-600 dark:bg-green-700 text-white'
                )}
                role="listitem"
                aria-label={`Espacio ${area}: ${isOccupied ? 'ocupado' : 'libre'}`}
              >
                {isOccupied ? (
                  <AlertCircle className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <CheckCircle className="h-6 w-6" aria-hidden="true" />
                )}
                <p className="font-bold text-sm truncate w-full text-center">{area}</p>
                <Badge variant={isOccupied ? 'destructive' : 'default'} className="mt-1">
                  {isOccupied ? 'Ocupado' : 'Libre'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {wsError && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Actualizaciones en tiempo real desconectadas. Recarga la página si el problema persiste.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
