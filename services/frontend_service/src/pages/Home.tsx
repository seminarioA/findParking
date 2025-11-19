import { useState, useEffect, useMemo } from 'react';
import { Volume2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import OccupancySummary from '@/components/parking/OccupancySummary';
import ParkingSpotGrid from '@/components/parking/ParkingSpotGrid';
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import type { OccupancyData } from '@/types/occupancy';
import { apiGet, endpoints } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function Home() {
  const { user, token } = useAuth();
  const { speak, isSupported: isSpeechSupported, isSpeaking } = useSpeechSynthesis();
  const [occupancyData, setOccupancyData] = useState<OccupancyData | null>(null);
  const [cameraId] = useState<string>('entrada1');

  const computeFromPayload = (payload: { areas: Record<string, number>; summary: { occupied: number; free: number } }): OccupancyData => {
    const total = payload.summary.occupied + payload.summary.free;
    const percentage = total > 0 ? Math.round((payload.summary.free / total) * 100) : 0;
    const spots = Object.entries(payload.areas).map(([id, val]) => ({
      id,
      status: val === 1 ? 'occupied' : 'free' as const,
      type: 'regular' as const,
    }));
    return {
      summary: { ...payload.summary, total, percentage },
      spots,
      lastUpdated: new Date().toISOString(),
      cameraId,
    };
  };

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    if (!token) return;
    (async () => {
      try {
        const data = await apiGet<{ areas: Record<string, number>; summary: { occupied: number; free: number } }>(
          endpoints.occupancy(cameraId),
          { token }
        );
        if (!cancelled) setOccupancyData(computeFromPayload(data));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error cargando ocupación:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, cameraId]);

  // Realtime updates via WS (Occupancy Service expects token in query string)
  const wsUrl = useMemo(() => (token ? endpoints.occupancyWs(cameraId, token) : null), [cameraId, token]);
  useWebSocket<{ areas: Record<string, number>; summary: { occupied: number; free: number } }>(wsUrl, {
    onMessage: (payload) => setOccupancyData(computeFromPayload(payload)),
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  });

  const handleVoiceGuidance = () => {
    if (!isSpeechSupported) return;

    const free = occupancyData?.summary.free ?? 0;
    const total = occupancyData?.summary.total ?? 0;
    const message = free > 0
      ? `Hay ${free} espacios disponibles de ${total} totales`
      : 'No hay espacios disponibles en este momento';

    speak(message);
  };

  const availableSpots = (occupancyData?.spots ?? []).filter(spot => spot.status === 'free');

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Estacionamiento" subtitle="UTP Sede Piura" showAdmin />

      <main className="p-4 space-y-4">
        <Alert className="bg-warning/20 border-warning">
          <AlertCircle className="h-4 w-4 text-warning-foreground" />
          <AlertDescription className="text-warning-foreground">
            <span className="font-bold">Aviso: 15 de Octubre:</span> Estacionamiento cerrado por evento, dirígete al estacionamiento del Real Plaza.
          </AlertDescription>
        </Alert>

        {occupancyData && <OccupancySummary summary={occupancyData.summary} />}

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4">Espacios disponibles cercanos</h3>
            <ParkingSpotGrid spots={availableSpots} limit={8} />
          </CardContent>
        </Card>

        {isSpeechSupported && (
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleVoiceGuidance}
                disabled={isSpeaking}
                size="lg"
                className="w-full gap-2"
              >
                <Volume2 className="h-5 w-5" />
                {isSpeaking ? 'Reproduciendo...' : 'Indicación por voz'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Todas las plazas</h3>
              <p className="text-sm text-muted-foreground">Cámara {cameraId}</p>
            </div>
            {occupancyData && <ParkingSpotGrid spots={occupancyData.spots} />}
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
