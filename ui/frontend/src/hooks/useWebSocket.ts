import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketOptions<T> {
  onMessage?: (data: T) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (event: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  protocols?: string | string[];
}

export function useWebSocket<T>(
  url: string | null,
  options: UseWebSocketOptions<T> = {}
) {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    protocols,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const onMessageRef = useRef<typeof onMessage>();
  const onOpenRef = useRef<typeof onOpen>();
  const onCloseRef = useRef<typeof onClose>();
  const onErrorRef = useRef<typeof onError>();

  // Keep callback refs updated without changing connect's identity
  useEffect(() => {
    onMessageRef.current = onMessage;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;
  }, [onMessage, onOpen, onClose, onError]);

  const connect = useCallback(() => {
    if (!url) return;

    // Avoid duplicate connections when already OPEN or CONNECTING
    const state = wsRef.current?.readyState;
    if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) return;

    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    try {
      const ws = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onOpenRef.current?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as T;
          onMessageRef.current?.(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        setError('Error de conexión WebSocket');
        onErrorRef.current?.(event);
      };

      ws.onclose = () => {
        setIsConnected(false);
        onCloseRef.current?.();

        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const attempt = reconnectAttemptsRef.current;
          // Exponential backoff with cap at 30s
          const delay = Math.min(reconnectInterval * Math.pow(2, attempt - 1), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setError('No se pudo establecer conexión después de varios intentos');
        }
      };

      wsRef.current = ws;
    } catch (err) {
      setError('Error al crear conexión WebSocket');
      console.error('WebSocket connection error:', err);
    }
  }, [url, reconnectInterval, maxReconnectAttempts, protocols]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    // If URL changes or becomes available, (re)connect
    if (url) {
      connect();
    } else {
      // If url becomes null, ensure we disconnect and reset attempts
      disconnect();
      reconnectAttemptsRef.current = 0;
      setError(null);
    }
    return () => {
      // Cleanup on unmount or url change
      disconnect();
    };
  }, [url, connect, disconnect]);

  return {
    isConnected,
    error,
    sendMessage,
    disconnect,
  };
}
