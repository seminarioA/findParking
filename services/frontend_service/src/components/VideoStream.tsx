import { useRef, useEffect, useState } from 'react';
import { Maximize2, Minimize2, Video, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VideoStreamProps {
  cameraId: string;
  token: string;
}

export default function VideoStream({ cameraId, token }: VideoStreamProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [mode, setMode] = useState<'processed' | 'original'>('processed');
  const [maximized, setMaximized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const endpoint = mode === 'original' ? 'raw' : 'processed';
    const wsUrl = `/api/video/${cameraId}/${endpoint}`;
    
    try {
      const ws = new WebSocket(wsUrl, token);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        setError('');
      };

      ws.onmessage = (event) => {
        if (imgRef.current && event.data instanceof ArrayBuffer) {
          const blob = new Blob([event.data], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          if (imgRef.current.src) {
            URL.revokeObjectURL(imgRef.current.src);
          }
          imgRef.current.src = url;
        }
      };

      ws.onerror = () => {
        setError('Error de conexión con el video en tiempo real');
      };

      ws.onclose = (event) => {
        if (event.code !== 1000) {
          setError('Conexión de video cerrada inesperadamente');
        }
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      setError('No se pudo establecer conexión con el video');
    }
  }, [cameraId, token, mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'processed' ? 'original' : 'processed'));
  };

  const toggleMaximize = () => {
    setMaximized((prev) => !prev);
  };

  const containerClasses = maximized
    ? 'fixed inset-0 z-50 bg-background flex items-center justify-center p-0'
    : 'w-full';

  return (
    <div className={containerClasses} role="region" aria-label="Transmisión de video en vivo">
      <Card className={maximized ? 'w-full h-full rounded-none border-0' : 'w-full'}>
        <CardHeader className={maximized ? 'absolute top-4 left-4 right-4 z-10 bg-card/90 backdrop-blur rounded-lg' : ''}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">
              Video {mode === 'processed' ? 'procesado' : 'original'} - Cámara {cameraId}
            </CardTitle>
            {maximized && (
              <Button
                onClick={toggleMaximize}
                size="icon"
                variant="secondary"
                aria-label="Salir de pantalla completa"
              >
                <Minimize2 className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className={maximized ? 'h-full flex flex-col items-center justify-center p-4' : 'space-y-4'}>
          {error ? (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className={maximized ? 'w-full h-[80vh] flex items-center justify-center' : 'w-full aspect-video bg-muted rounded-lg overflow-hidden'}>
                <img
                  ref={imgRef}
                  alt={`Transmisión de video ${mode === 'processed' ? 'procesada' : 'original'} de la cámara ${cameraId}`}
                  className={maximized ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'}
                />
              </div>

              <div className={maximized ? 'absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3' : 'flex gap-3 flex-wrap justify-center'}>
                <Button
                  onClick={toggleMode}
                  variant={mode === 'processed' ? 'default' : 'secondary'}
                  className="gap-2"
                  aria-label={`Cambiar a video ${mode === 'processed' ? 'original' : 'procesado'}`}
                >
                  {mode === 'processed' ? (
                    <>
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      Ver original
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" aria-hidden="true" />
                      Ver procesado
                    </>
                  )}
                </Button>

                {!maximized && (
                  <Button
                    onClick={toggleMaximize}
                    variant="outline"
                    className="gap-2"
                    aria-label="Ver en pantalla completa"
                  >
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                    Maximizar
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
