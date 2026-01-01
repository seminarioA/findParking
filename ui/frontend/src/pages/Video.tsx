import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { endpoints } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Video() {
  const { token } = useAuth();
  const [cameraId, setCameraId] = useState('entrada1');
  const [mode, setMode] = useState<'processed' | 'raw'>('processed');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lastUrlRef = useRef<string | null>(null);
  const pendingRevokeRef = useRef<string | null>(null);

  const wsUrl = useMemo(() => {
    if (!cameraId) return null;
    return mode === 'processed'
      ? endpoints.videoProcessedWs(cameraId)
      : endpoints.videoRawWs(cameraId);
  }, [cameraId, mode]);

  useEffect(() => {
    if (!token || !wsUrl) return;

    setError(null);
    const ws = new WebSocket(wsUrl, token);
    wsRef.current = ws;
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        let blob: Blob;
        if (event.data instanceof Blob) {
          blob = event.data as Blob;
        } else if (event.data instanceof ArrayBuffer) {
          blob = new Blob([event.data], { type: 'image/jpeg' });
        } else {
          // Ignore non-binary messages
          return;
        }
        const url = URL.createObjectURL(blob);
        // Defer revoking the previous URL until the next <img> load
        if (pendingRevokeRef.current) {
          try { URL.revokeObjectURL(pendingRevokeRef.current); } catch {}
          pendingRevokeRef.current = null;
        }
        pendingRevokeRef.current = lastUrlRef.current;
        lastUrlRef.current = url;
        setFrameUrl(url);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error processing frame', e);
      }
    };

    ws.onerror = () => {
      setError('Error de conexión al stream');
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
      if (lastUrlRef.current) {
        URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = null;
      }
      if (pendingRevokeRef.current) {
        URL.revokeObjectURL(pendingRevokeRef.current);
        pendingRevokeRef.current = null;
      }
    };
  }, [token, wsUrl]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Video" subtitle="Stream de cámara" />
      <main className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground" htmlFor="camera">Cámara:</label>
            <select
              id="camera"
              className="border rounded px-2 py-1 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={cameraId}
              onChange={(e) => setCameraId(e.target.value)}
            >
              <option value="entrada1">Entrada 1</option>
            </select>
          </div>
          <div className="inline-flex rounded-md overflow-hidden border bg-muted/40">
            <Button
              variant={mode === 'processed' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-none px-4 ${mode === 'processed' ? '' : 'text-muted-foreground hover:bg-muted'} transition-colors`}
              aria-pressed={mode === 'processed'}
              onClick={() => setMode('processed')}
            >
              Procesado
            </Button>
            <Button
              variant={mode === 'raw' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-none px-4 border-l ${mode === 'raw' ? '' : 'text-muted-foreground hover:bg-muted'} transition-colors`}
              aria-pressed={mode === 'raw'}
              onClick={() => setMode('raw')}
            >
              Crudo
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden aspect-video flex items-center justify-center">
          {frameUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={frameUrl}
              alt="Frame"
              className="w-full h-full object-contain"
              onLoad={() => {
                if (pendingRevokeRef.current) {
                  try { URL.revokeObjectURL(pendingRevokeRef.current); } catch {}
                  pendingRevokeRef.current = null;
                }
              }}
              onError={() => {
                // Skip bad frames and keep streaming; do not block
                // Optionally revoke current to avoid leaks
                if (frameUrl) {
                  try { URL.revokeObjectURL(frameUrl); } catch {}
                }
              }}
            />
          ) : (
            <p className="text-muted-foreground">
              {error ? error : isConnected ? 'Esperando frames…' : 'Conectando…'}
            </p>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
